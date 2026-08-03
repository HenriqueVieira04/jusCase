# Histórico

Aqui registrei toda a minha linha de raciocínio e anotações do que fiz para entregar o case com sucesso. O .md de tasks ficou dedicado para destrinchar o plano de execução (assim que concluí todas as minhas pesquisas e formulei o plano), e deixei um índice lá que conecta o que está presente aqui para justificar minhas escolhas.

À primeira vista, o que me veio à mente foi entender melhor a parte do autocomplete em si. Pensei de primeira no autocomplete que já vem presente nos teclados dos celulares, que existe há muito tempo (quando o hardware era mais limitado do que é hoje) e funciona de forma local, então talvez fosse a solução ideal. Busquei outras referências para saber se era realmente a melhor abordagem e, enquanto isso, explorei as possibilidades que já tinha em mente.

LLMs pequenos foi a primeira coisa que encontrei na pesquisa que resolvia o problema. Modelos como o qwen 2.5 0.5B resolvem (e até mais que isso, por que entendem longas janelas de contexto). O ponto é: o quão longo esse autocomplete precisava ser. Não era nem de longe a solução mais leve, porque mesmo esses LLMs pequenos exigiam por volta de 1.5GB de RAM, uma quantidade relevante, talvez estivesse usando "uma bazuca pra matar uma formiga". Deixei anotado para fazer um questionamento posteriormente. O complicado é que esses modelos precisam estar baixados no armazenamento local (ou talvez não, talvez achasse um provedor que não tivesse limites de requests tão rígidos, pelo menos para este case), porque parti da premissa de que devo ter ao menos uma parte da solução que possa rodar localmente caso a internet caia. Mas essa solução de LLMs pequenos, pelo menos para a parte local, ficou descartada por agora.

Na próxima pesquisa, vi que havia uma abordagem para resolver o problema com redes neurais recorrentes. Usa-se uma RNN para gerar o autocomplete de caráter por caráter até se gerar uma palavra inteira, iterando isso, temos um autocomplete. Mas o ponto é que o autocomplete desconsidera o contexto da frase em si, só olha para a construção atual da palavra (como uma cadeia de markov). É extremamente barato e pode ser treinado para uma área específica, como a jurídica, mas a ausência de contexto inviabilizou totalmente essa solução para mim.

Pesquisei mais sobre o fastText da Meta, aparentemente a solução mais adotada para resolver esse problema. O fastText da Meta é mais uma ferramenta de pesquisa que faz quase que uma espécie de embedding/slicing do que está sendo digitado na frase e busca qual conjunto pronto já presente no catálogo. Eu teria que meio que treinar o modelo com uma base pra fazer isso funcionar. O que de início parecia não ser uma alternativa muito viável, depois demonstrou potencial: descobri datasets no Kaggle de n-grams mas com temas não tão interessantes , dá pra treinar um meilisearch (fastText + base de treino) com esse dataset e fazer com que se comporte como um autocomplete de pesquisa. Verifiquei a viabilidade disso, pois podia ser a abordagem que rodaria de forma offline no meu case.

Tentei achar uma base mais generalista para o meilisearch, mas não havia nenhuma disponível. No pdf de especificação dizia que eu poderia escolher o tema, então escolhi o de assuntos jurídicos disponibilizados pelo CNJ, porque achei o tema bacana já que estou inscrito numa vaga de software relacionado ao direito e porque havia uma quantidade boa de termos. O ponto é que a API deles não possui uma forma de retornar todos os termos de uma vez, percebi então que poderia fazer a busca pelo código genérico do CNJ de um determinado assunto, que a API me retornava o assunto em si.

Tinha solicitado à IA um script simples em python que fizesse o trabalho, foi entregue um script que a fizia as buscas de forma ordenada letra por letra, salvava em um set para evitar repetições e depois guardasse em disco. Isso não funcionou pois o retorno da api era nulo para pesquisas de uma letra só, pesquisando um pouco mais percebi que cada assunto em sua descrição era indexado por um código, fiz o teste de buscar por código diretamente, e obtive o retorno exato do assunto. Com a nova ideia, alterei o código para pesquisar por código e não por letra unitária separada, com bruteforce coletei todos os termos em um único json capaz de ser utilizado num meilisearch que foi muito rápido de baixar, consome pouco recurso de hardware e funciona offline. A partir daí, valia mais fazer as outras partes do case que ainda faltavam, e com o tempo que sobrasse buscar explorar alternativas ao meilisearch.

Criei o repositório, linkei no github e iniciei o react + tailwind. Fiz uso de IA para ajudar a identificar porque os erros de conexão entre o vite e o tailwind estavam ocorrendo, bem como para aprender a utilizar o vitest para o posterior CI no github actions. Usei apenas para consulta nesse caso, a implementação foi feita manualmente tendo como propósito aprender a tecnologia.

Utilizei a IA para acelerar o processo de inserção dos componentes em app.tsx. Pedi para que colocasse o darkmode que tinha feito manualmente em um contexto que pudesse ser exportado em toda a aplicação, não tive que mexer em nada gerado por ela nessa parte. Quanto aos componentes, pedi que não fizesse tudo diretamente em flex, que foi o que foi entregue após o primeiro prompt, e sim que deixasse o lightmode selector em position absolute pra não bagunçar tanto o front.

Utilizei a IA para que percorresse o front e fizesse uma refatoração simples, deixando o código responsivo com as features que o tailwind disponibiliza. As alterações foram boas, mesmo mudando alguns parâmetros de tamanhos que eu tinha definido quando estava codando a versão desktop, a sensação de uso da versão desktop não foi alterada. A responsividade para o mobile foi implementada e também ficou de acordo.

Usei a IA para me ajudar a implementar o highlighter. De princípio foi entregue um código que por si só filtrava as sugestões mockadas, mas isso foi rejeitado, já que isso seria feito no lado do backend para ter um melhor desempenho. Pedi então que só implementasse o highlighter, a segunda versão entregou isso, mas o highlighter entregue destacava letra a letra correspondente, o que não me pareceu uma boa forma de implementar. Pedi para ela fazer um .split() dos termos de busca e, para cada sugestão, também fazer um .split() e checar se o termo está na busca. A IA seguiu a lógica solicitada e a implementação ficou de acordo com o que se desejava.
 
__(ANOTAÇÃO: ESSE COMPONENTE FOI ALTERADO APÓS REVISÃO POSTERIOR QUE ESTÁ ESCRITA ADIANTE PRÓXIMO DO FINAL DO TEXTO)__

Pedi para a IA implementar alguns testes padrão para o front. Ainda não tenho tanto conhecimento sobre quais testes são realmente mais prioritários que outros e quais os cruciais que ainda ficaram de fora, mas no momento isso foi suficiente para checar e aprender o funcionamento da esteira de CI do github. Ficou pendente uma revisão mais assídua desses testes gerados.

Não estava entendendo um erro de Lint que estava sendo retornado; a IA resolveu. Aparentemente é um #define do plugin do ESLint que não permite múltipla exportação dentro de componentes React. Assim, tipificação, criação e definição/exportação foram separadas para corrigir o erro de Lint.

Percebi que estava usando pouca IA até agora, visto que o uso consciente dela era um dos requisitos, então tentei usar um pouco mais já que o lado do backend não era uma área com tanta familiaridade. Escrevi o código do Express, pedi para a IA integrar com o meilisearch pois estava tendo problemas quanto à parte das bibliotecas, e também pedi para a IA fazer a integração do graphQL + Apollo Server com o backend, visto que essa seria a forma de comunicação entre o front e o backend.

Na integração do apollo com o backend tomei a decisão de fazer o downgrade do express para a versão 4, descobri que o apollo server v4 não é compatível com o express 5 e isso estava quebrando a rota do graphql, com o express 4 a integração passou a funcionar normalmente. Também tive que corrigir a chave de acesso padrão do seed, estava usando uma chave fixa que não batia com a chave que o meilisearch gera quando sobe, o que resultava em 403, corrigi para usar a chave correta definida no ambiente. As bibliotecas do meilisearch foram corrigidas pela IA, a questão do nome da classe, que na versão 0.60 se chama Meilisearch e não MeiliSearch, além de ser um pacote commonjs que precisou ser importado com createRequire dentro dos módulos esm que eu estava utilizando.

Revisei toda a integração do backend e suas partes e, após criar os arquivos docker para o front e o back, removi todo o ferramental desnecessário que estava sendo utilizado para rodar o código localmente, visto que o run passou a ser executado via docker. Quando fui subir o projeto pela primeira vez pelo docker, percebi que o meilisearch não subia com os dados carregados e precisava de um docker down seguido de um up pra funcionar. Era uma race condition onde o seed tentava popular antes do meilisearch estar pronto e morria. Tomei a decisão de corrigir isso com um healthcheck no meilisearch, fazendo o seed e o backend dependerem do service_healthy e do service_completed_successfully, além de adicionar um retry dentro do próprio seed que fica aguardando o meilisearch responder antes de popular os dados.

Refatorei o server.js para que ficasse testável, exportando o typeDefs, os resolvers e uma função createApp que monta o express, deixando o servidor só subir quando o arquivo é executado diretamente. Isso permitiu testar a API sem precisar abrir uma porta real nos testes. Também revisei a estrutura do front e integrei ele com o back: criei um arquivo de api que faz o fetch para o graphql e o searchbar passou a buscar as sugestões do servidor em vez de usar as mockadas, com um debounce de 250ms, só disparando a requisição quando o que foi digitado tem no mínimo 4 caracteres efetivos e limitando a exibição a no máximo 10 sugestões. Isso foi importante para impedir requisições desnecessárias até que o usuário terminasse de digitar.

Implementei também os testes do backend, cobrindo os resolvers, a validação do schema do graphql e a integração http. Mockei o meilisearch pra não depender dele rodando na hora dos testes. Separei a esteira de CI no github actions em dois jobs, um pro frontend que roda lint, type check e os testes, e outro pro backend que roda os testes dele, tudo rodando em paralelo. Por fim, mudei a porta do frontend de 5173 pra 5178 tanto no docker compose quanto no dockerfile do front, pra evitar conflito com outras ferramentas que costumam ocupar a porta 5173.

Revisei os testes implementados para o front e para o back e removi as redundâncias que estavam implementadas neles.

Finalmente, pedi a IA que criasse uma LEIAME.md para ajudar na execução do projeto no docker com os comandos corretos.

A partir de esclarecimentos obtidos via email quanto aos critérios que deveriam ser utilizados para que houvesse a atuação da função hightlightmatch(), alterei a lógica utilizada para que os textos contidos nas sugestões que fossem os destacados estivissem totalmente de acordo com o que fora digitado pelo usuário, seguindo uma lógica de prefixo completo ao invés da implementada anteriormente que seguia um destaque difuso para cada termo contido na busca. Além disso alterei o testes que passavam por essa função para que refletissem o funcionamento da nova lógica implementada.

# Implementações posteriores

Depois de entregar o case, tenho em mente algumas evoluções que gostaria de fazer. A primeira é aprender mais a fundo o meilisearch a ponto de customizar a forma como estou usando ele, mexendo em configurações como os pesos de relevância e os filtros para que as sugestões retornadas sejam mais inteligentes e se aproximem mais do que o usuário realmente procura. Outra coisa que gostaria de implementar é uma integração maior com o ecossistema do CNJ, de modo que, dado o assunto buscado, eu já tivesse em um banco de dados próprio ou buscasse em alguma api do CNJ outras informações e documentos relacionados àquele assunto para apresentar ao usuário junto das sugestões, enriquecendo o resultado da busca. Por fim, também gostaria de implementar alguma autenticação básica, mesmo que simples, para poder começar a idealizar ferramentas como a de favoritar buscas, que só fazem sentido quando existe a noção de usuário por trás da aplicação.

# Análise suggestions.js

## Positivos:

Do código fornecido, identifico dois pontos positivos: 

1. Foi implementada a checagem do tamanho da query digitada (query.length < 4) antes de realizar a requisição HTTP. Isso evita chamadas desnecessárias à API enquanto o usuário ainda não digitou o mínimo necessário.

2. Caso o tamanho da query viole a restrição de tamanho, a função atualiza o estado do React (setSuggestions([])) definindo as sugestões como vazias. Isso garante a limpeza da interface diretamente no frontend, sem a necessidade de uma nova chamada à API que retornaria uma lista vazia.

## Negativos:

Analisando o suggestions.js, percebem-se quatro pontos que merecem atenção: 

1. Incoerência com o padrão do GraphQL na forma da requisição, o código usa GET passando a query como parâmetro de URL (/graphql?q=${query}). Embora a especificação do GraphQL admita requisições GET via query string, o padrão utilizado na indústria (e por bibliotecas como Apollo Client) é o envio de requisições POST contendo um corpo JSON no formato { query, variables }. Além de ser o padrão idiomático, requisições POST lidam melhor com caracteres especiais e queries mais complexas sem esbarrar nos limites de tamanho de URL de navegadores.

2. O .slice(0, 10) no lado do cliente, o frontend recebe todo o retorno do backend para depois aplicar o fatiamento. O back deveria ser o responsável por controlar o fatiamento dos dados (ex: suggestions(query: $query, limit: 20)). Transferir dados que serão descartados no cliente desperdiça dados de internet, processamento e memória no dispositivo do usuário.

3. Há uma ausência de tratamento de erros, não existe try/catch tratando falhas de rede nem verificação se response.ok é válido. Se o backend estiver fora do ar ou retornar um status 500, o retorno response.json() pode ser inválido, gerando uma "exception" não tratada que pode quebrar o React.

4. Há a falta de um debounce na digitação, a função dispara um fetch a cada caractere digitado. Se o usuário digitar rapidamente, a função será invocada várias vezes em milissegundos. Sem um mecanismo de debounce ocorrem multiplas chamadas desnecessárias à API.

## Mudanças:

Seguem as alterações que eu faria no código

1. Troca da URL com parâmetro (/graphql?q=...) por requisições POST com JSON { query, variables }, seguindo o padrão utilizado no GraphQL.  

2. Remoção do .slice(0, 10) no front, o limit de resultados passaria a ser controlado diretamente no backend para não retornar sugestões que não seriam utilizadas.  

3. Mecanismo de Debounce para a adição de intervalo no input para evitar uma requisição a cada tecla.

4. Inclusão de blocos try/catch e checagem de status HTTP para evitar falhas não tratadas na interface do React.
 
