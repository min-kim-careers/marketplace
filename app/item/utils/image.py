import os
from typing import List
from uuid import uuid4

from fastapi import UploadFile

from app.core import env
from app.core.logger import log_exception

STORAGE_DIR = env.CONTAINER_IMAGE_DIR

os.makedirs(STORAGE_DIR, exist_ok=True)
os.chmod(STORAGE_DIR, 0o755)


@log_exception
async def store_image(image: UploadFile):
    """returns filename"""
    filename = uuid4().hex + ".jpeg"

    storage_path = os.path.join(STORAGE_DIR, filename)
    with open(storage_path, "wb") as f:
        content = await image.read()
        f.write(content)

    return filename


@log_exception
async def store_image_bulk(images: list[UploadFile]):
    """returns filenames list"""
    filenames = []
    for img in images:
        try:
            filename = await store_image(img)
        except Exception:
            remove_image_bulk(filenames)
            raise
        filenames += [filename]
    return filenames


@log_exception
def remove_image(fn: str):
    os.remove(os.path.join(STORAGE_DIR, fn))


@log_exception
def remove_image_bulk(fns: List[str]):
    for fn in fns:
        os.remove(os.path.join(STORAGE_DIR, fn))
