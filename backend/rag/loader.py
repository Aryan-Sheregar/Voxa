from langchain.document_loaders import TextLoader

def load_user_documents(file_path):
    loader = TextLoader(file_path)
    return loader.load()