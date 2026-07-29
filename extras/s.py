import json
import string
from zeep import Client

WSDL_URL = "https://www.cnj.jus.br/sgt/sgt_ws.php?wsdl"
client = Client(WSDL_URL)
i = 1

termos_unicos = set()

print("Iniciando extração do CNJ...")

# Percorre os codigos
while i < 12887:
    try:
        response = client.service.pesquisarItemPublicoWS(
            tipoTabela="A",       
            tipoPesquisa="N",     
            valorPesquisa=i
        )

        if response:
            count = 0
            for item in response:
                nome = getattr(item, 'nome', None)
                if nome:
                    nome_limpo = nome.strip()
                    if nome_limpo:
                        termos_unicos.add(nome_limpo)
                        count += 1
            
            print(f"Codigo '{i}': {count} resultados processados.")

    except Exception as e:
        print(f"Erro no codigo'{i}': {e}")

    i += 1

# Transforma o set de termos em objetos JSON indexados para o Meilisearch
dataset_meilisearch = [
    {
        "id": f"cnj_{idx + 1}",
        "term": termo
    }
    for idx, termo in enumerate(sorted(termos_unicos))
]

with open("cnj_assuntos.json", "w", encoding="utf-8") as f:
    json.dump(dataset_meilisearch, f, ensure_ascii=False, indent=2)

print(f"\nSucesso! {len(dataset_meilisearch)} termos únicos salvos sem duplicatas.")