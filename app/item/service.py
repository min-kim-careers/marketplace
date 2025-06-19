import re
from typing import List

from fastapi import UploadFile
from app.common.schemas.error import ErrorResponse
from app.item.schemas.requests import ItemInRequest
from app.storage.image import store_image_bulk


async def upload_images_and_get_urls(upload_images: List[UploadFile], image_urls: List[str]) -> List[str] | None:
  new_urls = await store_image_bulk(upload_images)
  if not new_urls:
      return None
  
  for image_url_index, existing_url in enumerate(image_urls):
      match = re.match(r"^\{\{(\d+)\}\}$", existing_url)
      if match:
          placeholder_index = int(match.group(1))
          image_urls[image_url_index] = new_urls[placeholder_index]
  return new_urls