from app.core import logger


import httpx


def handle_raise_for_status(response: httpx.Response) -> None:
    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        logger.error(
            f"HTTP error {exc.response.status_code} for {exc.request.url}: {exc.response.text}"
        )
        raise