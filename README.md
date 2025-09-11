# Restaurante Célia Contagem (v0.0.0-betatest)

Aplicação em pré-lançamento (versão: v0.0.0-betatest) com animação inicial e preparada como Progressive Web App (PWA) com manifesto, service worker, cache offline e banner de instalação.

---

## Pré-lançamento & PWA

O projeto já inclui:

- `manifest.webmanifest` com nome, versão (`version: 0.0.0-betatest`), tema e ícones (adicione os PNGs na pasta `icons/`).
- `sw.js` (service worker) com estratégia: network-first para navegação e cache-first para assets (APP_VERSION = v0.0.0-betatest).
- `sw.js` avançado com múltiplos caches (core, pages, assets, runtime), atualização agressiva e mensagem de nova versão.
- `version.json` para detecção remota de build e aviso de atualização.
- `offline.html` para fallback sem conexão.
- Banner de instalação personalizado sempre exibido em cada visita (requisito do cliente) enquanto não estiver instalado.

### Testar Localmente

Abra via um servidor (recomendado para o service worker funcionar). Exemplos:

Python 3:
```bash
python -m http.server 5173
```
Acesse: http://localhost:5173/

Node (npx serve):
```bash
npx serve .
```

### Instalar como App

1. Abra no Chrome / Edge / Android ou Safari iOS.
2. O banner aparecerá com o botão "Instalar" (Chrome/Android) ou instrução manual (iOS mostra alerta).
3. Após instalação o banner deixa de aparecer (display-mode standalone detectado).

### Ajustar Ícones
Coloque os arquivos PNG solicitados em `icons/` conforme `icons/README.txt`.

### Atualizar (Deployment)
1. Atualize `APP_VERSION` em `sw.js` e o campo `version` em `manifest.webmanifest` e `version.json`.
2. Faça commit e deploy (GitHub Pages). Usuários ativos verão aviso de nova versão.
3. Ícones ou assets renomeados: manter mesmo nome é seguro porque troca de versão invalida caches antigos.

### Próximos Passos (Sugestões)
- Adicionar ambiente de build (Vite/Next.js) quando iniciar desenvolvimento do app real.
- Implementar rota /api simulada para testes offline.
- Adicionar analytics leve (ex: Plausible) após consentimento.
- Criar componente de notificação para futura integração com Push API.

---

# Ferramenta de Geração de QR Code

## Introdução
A ferramenta de geração de QR Code foi desenvolvida para criar QR Codes de alta segurança de forma simples e eficiente. Ela está localizada na pasta `criar-qrcode`.

---

## Estrutura do Projeto
- **`generate_qrcode.py`**: Script principal para gerar QR Codes.
- **`MANUAL.md`**: Manual detalhado de uso da ferramenta.
- **`venv/`**: Ambiente virtual Python com as dependências necessárias.

---

## Pré-requisitos
1. **Python 3.12 ou superior** instalado no sistema.
2. **Ambiente virtual configurado** (já configurado na pasta `criar-qrcode/venv`).
3. Dependências instaladas:
   - Biblioteca `qrcode`.

---

## Como Usar a Ferramenta

### 1. Ativar o Ambiente Virtual
Antes de executar o script, ative o ambiente virtual:
