# Tarefas

## Indice

1. [De onde puxar o autocomplete?](#de-onde-puxar-o-autocomplete)
2. [Estudar como funciona e desenvolver](#estudar-como-funciona-e-desenvolver)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Extras](#extras-e-tarefas-assincronas)

---

## De onde puxar o autocomplete?

- como o autocomplete de teclados e do google funcionam?
- pesquisar quanto a tangibilidade de implementação:
  - RNN para autocomplete
  - Deploy de pequenos LLMs
  - Sugestão baseada em ranking
  - Meilisearch
  - LLMs disponíveis online para o autocomplete
- decidir qual método utilizar
- baixar o Meilisearch
- buscar tema adequado e uma base de dados para alimentar o Meilisearch
- escrever script capaz de minerar os assuntos e já deixa-los num formato adequado para o Meilisearch
- inserir dados de assuntos e testar o Meilisearch
- entender como passar e receber os valores do Meilisearch junto do backend
- entender como subir o Meilisearch no docker
- tentar implementar outros dos métodos descobertos acima para verificar viabilidade com o tempo que sobrar

---

## Estudar como funciona e desenvolver

### GraphQL, o que é, como funciona

- instalar dependencias no back e fazer a conexão com o front
- implementar o schema de tradução entre as camadas da aplicação

---

## Frontend

- implementar um frontend básico com react/vite + tailwind
- implementar componentes do front
  - implementar barra de busca com debounce para evitar chamadas desnecessárias
  - implementar dropdown de resultados com a regra de negócio imbutida
  - fazer a logo no canva
  - implementar light/dark mode
- deixar o frontend responsivo
- implementar lógica de destaque para retorno exato comparado ao conteudo do input
- implementar lógica de busca e retorno do Meilisearch para exibição no front (preciso já ter feito o back)
- dockerizar

### Esteira de Lint e Testes

- entender como funciona a esteira de testes e sua relação com os PRs do github
- entender como funciona o teste de sintaxe e como ele entra na parte do CI
- entender como integrar o vitest
- gerar script de workflow
- pesquisar quais testes geralmente são gerados e como eles se encaixariam no contexto do case
- gerar testes para os componentes da aplicação:
  - testes do front
  - testes do back (precisa do back já pronto)

---

## Backend

- implementar um backend simples em express
- pesquisar como integrar esse backend com um graphQL
- pesquisar como puxar valores do Meilisearch para o backend para posterior despaixe
- colocar conteiner do backend no compose do docker

---

## Extras e tarefas assincronas

- verificar se estou usando muita IA ou pouca IA e adequar os usos posteriores
- incrementar a documentação dos .md
- colocar comentarios no código
- gerar o docker para cada parte quando concluída
- testar cada uma das partes e a integração entre elas sempre que possível
- corrigir BUGS imediatamente após encontrados, além de fazer adequações a partir de requisitos novos/revisados
- ANALISAR suggestions.js ao final
