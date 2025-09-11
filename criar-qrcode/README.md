# Ferramenta de Geração de QR Code

## Descrição
Esta ferramenta foi desenvolvida para gerar QR Codes de alta segurança de forma simples e eficiente. O QR Code gerado pode ser usado para compartilhar links, informações ou qualquer outro dado que você desejar. O script utiliza a biblioteca `qrcode` para criar QR Codes no formato SVG.

---

## Estrutura do Projeto

```
criar-qrcode/
│
├── generate_qrcode.py   # Script principal para gerar QR Codes
├── MANUAL.md            # Manual de uso detalhado
├── venv/                # Ambiente virtual com dependências instaladas
```

---

## Pré-requisitos
1. **Python 3.12 ou superior** instalado no sistema.
2. **Ambiente virtual configurado** (já incluído na pasta `venv`).
3. Dependências instaladas:
   - Biblioteca `qrcode`.

---

## Configuração e Uso

### 1. Ativar o Ambiente Virtual
Antes de executar o script, ative o ambiente virtual:
```bash
source venv/bin/activate
```

### 2. Editar o Script
Abra o arquivo `generate_qrcode.py` e edite as seguintes variáveis conforme necessário:
- **`data_to_encode`**: Substitua pelo dado que deseja codificar no QR Code (exemplo: um link ou texto).
- **`output_path`**: Substitua pelo caminho e nome do arquivo onde o QR Code será salvo (exemplo: `meu_qrcode.svg`).

Exemplo:
```python
data_to_encode = "https://meusite.com"
output_path = "meu_qrcode.svg"
```

### 3. Executar o Script
Execute o script para gerar o QR Code:
```bash
python generate_qrcode.py
```

### 4. Verificar o QR Code
O QR Code será salvo no caminho especificado em `output_path`. Abra o arquivo gerado para verificar o QR Code.

---

## Personalização
- **Tamanho do QR Code**: Altere o parâmetro `box_size` no script para ajustar o tamanho dos blocos do QR Code.
- **Correção de Erro**: O nível de correção de erro pode ser ajustado em `error_correction` (opções: `L`, `M`, `Q`, `H`).

---

## Solução de Problemas
- **Erro ao instalar dependências**: Certifique-se de que o ambiente virtual está ativado antes de instalar pacotes.
- **QR Code não gerado**: Verifique se os caminhos e permissões estão corretos.

---

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias.

---

## Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

**Divirta-se gerando seus QR Codes!**
