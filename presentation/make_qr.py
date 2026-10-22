"""QR-код на живую ссылку «Люмена» — в цветах системы."""
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask

URL = "https://work-1-jkolqlpeuzvxiuna.prod-runtime.all-hands.dev/"
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=14, border=2)
qr.add_data(URL)
qr.make(fit=True)
img = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(),
    color_mask=RadialGradiantColorMask(
        back_color=(255, 255, 255),
        center_color=(123, 108, 255),
        edge_color=(92, 200, 255)),
)
img.save("qr-lumen.png")
print("QR сохранён:", img.size)
