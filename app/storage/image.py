import os
from typing import List
from uuid import uuid4

from fastapi import UploadFile

IMAGE_DIR = "images"
os.makedirs(IMAGE_DIR, exist_ok=True)
os.chmod(IMAGE_DIR, 0o755)


async def store_image(image: UploadFile) -> str | None:
    try:
        filename = f"{uuid4().hex}_{image.filename}.jpeg"
        file_path = os.path.join(IMAGE_DIR, filename)

        with open(file_path, "wb") as f:
            content = await image.read()
            f.write(content)
        return f"/{IMAGE_DIR}/{filename}"
    except Exception as e:
        print("error storing images:", str(e))


async def store_image_bulk(images: List[UploadFile]) -> List[str] | None:
    urls = []
    for image in images:
        url = await store_image(image)
        if not url:
            return
        urls += [url]
    return urls


def remove_image_bulk(paths: List[str]) -> bool:
    success = True
    for path in paths:
        try:
            os.remove(path)
        except FileNotFoundError:
            pass
        except Exception:
            success = False
    return success
