import os

import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

app = FastAPI(title="Dashboard Financeiro API")

# Permite que o dashboard (Live Server) converse com a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def conectar():
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)


@app.get("/")
def raiz():
    return {"mensagem": "API do Dashboard Financeiro no ar"}


@app.get("/categorias")
def listar_categorias():
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute(
                "SELECT id, nome, tipo FROM categorias ORDER BY tipo, nome"
            )
            return cursor.fetchall()