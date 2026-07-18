from openai import OpenAI
from dotenv import load_dotenv

from readPDF import read_pdf_text

load_dotenv()

client = OpenAI()


def read_txt_file(txt_path: str) -> str:
    with open(txt_path, "r", encoding="utf-8") as f:
        return f.read()


# 向用户询问使用 txt 还是 pdf 导入
file_type = input("请选择导入的文件类型（1: txt，2: pdf，默认 1）：").strip()

if file_type == "2":
    pdf_path = input("请输入要读取的 pdf 文件路径（默认 report.pdf）：").strip()
    if not pdf_path:
        pdf_path = "report.pdf"
    document = read_pdf_text(pdf_path)
else:
    txt_path = input("请输入要读取的 txt 文件路径（默认 conflict.txt）：").strip()
    if not txt_path:
        txt_path = "conflict.txt"
    document = read_txt_file(txt_path)

prompt = f"""
你是一个社区管理记录助手。
请根据下面的管理文档，输出一份简短的管理报表。

要求：
1. 总结主要事件
2. 提取已经采取的管理动作
3. 列出未解决问题
4. 列出后续待办
5. 不要编造聊天记录中没有的信息

管理文档：
{document}
"""

response = client.responses.create(
    model="gpt-5",
    input=prompt
)

print(response.output_text)