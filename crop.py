from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

img = Image.open('client/src/assets/footer-photo-bg.png')
cropped = trim(img)
cropped.save('client/src/assets/footer-photo-bg.png')
print('Cropped successfully.')
