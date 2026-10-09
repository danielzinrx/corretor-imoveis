# Imóveis Edilson

Site do corretor **Edilson Carlos dos Santos – CRECI 6037**, com catálogo de imóveis, filtros, mapa e contato direto por WhatsApp. Os imóveis são cadastrados por um painel administrativo, sem mexer em código.

## Funcionalidades

- Página inicial com foto da casa em efeito 3D, apresentação do corretor, CRECI e frase de motivação
- Catálogo com filtros: tipo, cidade/região, quartos, suítes, vagas, valor, área útil e características (piscina, churrasqueira, ar-condicionado etc.)
- Tipos: casa, apartamento, lote/terreno/área, rural e loja (venda e aluguel)
- Página de cada imóvel com galeria de fotos, informações, Google Maps e botão de WhatsApp com mensagem pronta
- Links para WhatsApp, Instagram, e-mail e para o perfil no DF Imóveis
- Painel em `/admin` (login em `/admin/login`) para cadastrar, editar e excluir imóveis, com envio de várias fotos

## Tecnologias

React 18 · Vite 5 · React Router 6 · Firebase (Firestore, Auth e Storage)

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install            # instala as dependências
cp .env.example .env   # cria o arquivo de configuração (depois preencha)
npm run dev            # abre em http://localhost:5173
```

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera a versão final na pasta `dist/` |
| `npm run preview` | testa a versão final localmente |

## Configurando o Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com) e crie um projeto.
2. Em **Configurações do projeto > Seus apps**, registre um app da **Web** e copie as chaves para o `.env`.
3. Ative **Authentication > Método de login > E-mail/senha** e crie o usuário do corretor.
4. Ative o **Firestore Database** (modo produção).
5. Ative o **Storage** para as fotos.

> **Atenção:** projetos novos do Firebase exigem o plano **Blaze** (pago conforme o uso, com cota gratuita) para usar o Storage. Se preferir ficar no plano gratuito, as fotos podem ir para o Cloudinary (variáveis comentadas no `.env.example`).

### Regras de segurança

Todos podem **ler** os imóveis, mas só o corretor logado pode **gravar**. Troque o e-mail pelo do administrador.

**Firestore** (aba Regras):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /imoveis/{id} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email in ['ecarlossantos43@gmail.com'];
    }
  }
}
```

**Storage** (aba Regras):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /imoveis/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email in ['ecarlossantos43@gmail.com'];
    }
  }
}
```

## Estrutura de pastas

```
corretor-imoveis/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── public/            favicon, logo e imagens fixas
└── src/
    ├── config/        dados do site, Firebase e listas (tipos, regiões, características)
    ├── services/      acesso ao Firestore, Storage e Auth
    ├── hooks/         useImoveis, useFiltros
    ├── utils/         formatadores, link do WhatsApp
    ├── components/    layout, home, imoveis, admin, ui
    ├── pages/         Home, Imoveis, DetalheImovel, Sobre, Contato e admin/
    └── styles/        variáveis, estilos globais e efeito 3D
```

## Publicação

O site é estático, então pode ficar em **Firebase Hosting**, **Vercel** ou **Netlify**. Em qualquer um, configure:

- Comando de build: `npm run build`
- Pasta de saída: `dist`
- Redirecionar todas as rotas para `index.html` (o site usa rotas como `/imoveis/123`)
- As mesmas variáveis do `.env` no painel da hospedagem

Depois de publicar, ajuste `VITE_SITE_URL` para o endereço final e adicione o domínio em **Authentication > Configurações > Domínios autorizados**.

## Contato do corretor

- WhatsApp: (61) 98556-9820
- E-mail: ecarlossantos43@gmail.com
- Instagram: [@ecarlossantos43](https://www.instagram.com/ecarlossantos43/)
- Perfil no [DF Imóveis](https://www.dfimoveis.com.br/anunciante/edilson-carlos--3183)