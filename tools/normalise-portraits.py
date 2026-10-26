"""Normalise team portraits: remove background, consistent head-and-shoulders crop,
shared Lumen studio backdrop, 1200x1500 (4:5)."""
import sys, numpy as np, cv2
from PIL import Image, ImageOps, ImageFilter
from rembg import remove, new_session

OUT_W, OUT_H = 1200, 1500
FACE_FRAC = 0.42      # face height / frame height
EYE_Y = 0.46          # face centre position (fraction of height)
session = new_session("isnet-general-use")
cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def backdrop():
    y, x = np.mgrid[0:OUT_H, 0:OUT_W].astype(np.float32)
    top = np.array([0xEC, 0xE7, 0xDE], np.float32); bot = np.array([0xCF, 0xC6, 0xB5], np.float32)
    t = (y / OUT_H)[..., None]
    base = top * (1 - t) + bot * t
    d = np.sqrt(((x - OUT_W * 0.5) / OUT_W) ** 2 + ((y - OUT_H * 0.32) / OUT_H) ** 2)[..., None]
    glow = np.clip(1 - d / 0.55, 0, 1) ** 2 * 14
    vign = np.clip(d - 0.35, 0, 1) * 40
    img = np.clip(base + glow - vign, 0, 255).astype(np.uint8)
    return Image.fromarray(img, "RGB")

def process(src, dst):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if max(im.size) > 2200: im.thumbnail((2200, 2200), Image.LANCZOS)
    cut = remove(im, session=session, post_process_mask=True)  # RGBA
    alpha = np.array(cut.split()[-1])
    gray = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2GRAY)
    faces = cascade.detectMultiScale(gray, 1.1, 6, minSize=(int(im.width * 0.08),) * 2)
    if len(faces) == 0: raise SystemExit(f"no face in {src}")
    fx, fy, fw, fh = max(faces, key=lambda f: f[2] * f[3])
    scale = OUT_H * FACE_FRAC / fh
    ys, xs = np.where(alpha > 128)
    subj_bottom = ys.max()
    # ensure the body reaches the bottom of the frame (no floating torso)
    cy = fy + fh / 2
    need = (subj_bottom - cy) * scale
    # keep a constant face size; if the torso ends above the frame, fade it out softly
    W, H = int(im.width * scale), int(im.height * scale)
    if scale > 1.6:  # edge clean-up: small, already-cut-out photos have a jagged fringe
        rgba = np.array(cut)
        m = cv2.erode(rgba[..., 3], np.ones((3, 3), np.uint8), iterations=2)
        rgba[..., 3] = cv2.GaussianBlur(m, (0, 0), 1.1)
        cut = Image.fromarray(rgba, "RGBA")
    cut_s = cut.resize((W, H), Image.LANCZOS)
    ox = int(OUT_W / 2 - (fx + fw / 2) * scale)
    # Same face size for everyone; if this photo stops early, lower the head just enough
    # that the shoulders reach the bottom edge.
    eye = max(EYE_Y, 1 - (subj_bottom - cy) * scale / OUT_H + 0.005)
    oy = int(OUT_H * eye - cy * scale)
    end = oy + subj_bottom * scale  # where the subject ends inside the frame
    if end < OUT_H + 4:
        a = np.array(cut_s.split()[-1]).astype(np.float32)
        yy = np.arange(H)[:, None] + oy
        start = end - OUT_H * 0.10
        ramp = np.clip((end - yy) / (end - start), 0, 1)
        cut_s.putalpha(Image.fromarray((a * ramp).astype(np.uint8)))
    bg = backdrop()
    # soft contact shadow
    a = cut_s.split()[-1].filter(ImageFilter.GaussianBlur(28))
    shadow = Image.new("RGBA", cut_s.size, (40, 46, 60, 0)); shadow.putalpha(a.point(lambda v: v * 0.22))
    bg = bg.convert("RGBA"); bg.alpha_composite(shadow, (max(ox + 10, -10**6), oy + 14)) if False else None
    canvas = backdrop().convert("RGBA")
    layer = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0)); layer.paste(shadow, (ox + 12, oy + 16), shadow)
    canvas = Image.alpha_composite(canvas, layer)
    layer = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0)); layer.paste(cut_s, (ox, oy), cut_s)
    canvas = Image.alpha_composite(canvas, layer).convert("RGB")
    canvas.save(dst, "JPEG", quality=86, optimize=True, progressive=True)
    print(dst, "face", fw, "scale", round(scale, 2))

if __name__ == "__main__":
    for s, d in zip(sys.argv[1::2], sys.argv[2::2]): process(s, d)
