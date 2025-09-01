from langchain_community.document_loaders import TextLoader, PyPDFLoader, Docx2txtLoader
from unstructured.partition.auto import partition
from unstructured.staging.base import elements_to_json, elements_from_json
import os

class UnsupportedFileTypeError(Exception):
    pass

def load_user_documents(file_path):
    try:
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".docx"):
            loader = Docx2txtLoader(file_path)
        elif file_path.endswith(".txt"):
            loader = TextLoader(file_path)
        else:
            raise UnsupportedFileTypeError(f"Unsupported file type: {os.path.splitext(file_path)[1]}")
    except UnsupportedFileTypeError as e:
        raise e
    except Exception as e:
        # Catch other potential errors during file loading
        raise Exception(f"An error occurred while loading the file: {e}")

    return loader.load()