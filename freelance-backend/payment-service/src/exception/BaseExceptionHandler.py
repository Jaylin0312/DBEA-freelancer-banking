from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi import FastAPI
from models.BaseModels import BaseResponse
from datetime import datetime


def add_unicorn_exception_handler(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        print("400 Bad Request")
        error = BaseResponse(data={}, status="Bad request", errors=exc.errors());

        return JSONResponse(content=error.model_dump(exclude_unset=True), status_code=400)

    @app.exception_handler(StarletteHTTPException)
    async def forbidden_exception_handler(request, exc):
        if exc.status_code == 403:
            print("403 Forbidden")
            error = BaseResponse(data={}, status="Forbidden", errors=[{"message": "Forbidden access"}]);
            return JSONResponse(content=error.model_dump(exclude_unset=True), status_code=403)
        
        if exc.status_code == 404:
            print("404 Not Found")
            error = BaseResponse(data={}, status="Not Found", errors=[{"message": exc.detail}]);
            return JSONResponse(content=error.model_dump(exclude_unset=True), status_code=404)

    @app.exception_handler(Exception)
    async def internal_server_error_handler(request:Request, exc):
        print("500 Internal Server Error")
        error = BaseResponse(data={}, status="Internal server error", errors=[{"message": "Internal Server Error"}]);
        return JSONResponse(content=error.model_dump(exclude_unset=True), status_code=500)

def getCurrentTime():
    return datetime.now().strftime("%d/%m/%Y %H:%M:%S")