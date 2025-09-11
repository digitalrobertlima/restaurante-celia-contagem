# Importing necessary libraries
import qrcode
import qrcode.image.svg

def generate_secure_qrcode(data: str, output_file: str):
    """
    Generate a highly secure QR Code and save it to a file.

    Parameters:
        data (str): The data to encode in the QR Code.
        output_file (str): The file path to save the QR Code image.
    """
    # Configure QR Code
    qr = qrcode.QRCode(
        version=1,  # Controls the size of the QR Code (1 is the smallest, 40 is the largest)
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction
        box_size=10,  # Size of each box in the QR Code grid
        border=4,  # Thickness of the border (minimum is 4)
    )

    # Add data to the QR Code
    qr.add_data(data)
    qr.make(fit=True)

    # Generate and save the QR Code in SVG format
    img_svg = qr.make_image(fill_color="black", back_color="white", image_factory=qrcode.image.svg.SvgImage)
    img_svg.save(output_file)

    # Generate and save the QR Code in PNG format
    png_output_file = output_file.replace('.svg', '.png')
    img_png = qr.make_image(fill_color="black", back_color="white")
    img_png.save(png_output_file)

    print(f"QR Code generated and saved to {output_file} (SVG) and {png_output_file} (PNG)")

if __name__ == "__main__":
    # Example usage
    data_to_encode = "https://digitalrobertlima.github.io/restaurante-celia-contagem/"  # Replace with your data
    output_path = "qrcode-celia.svg"  # Replace with your desired output file path

    generate_secure_qrcode(data_to_encode, output_path)
