FROM mcr.microsoft.com/devcontainers/python:3.11

# Install required Python libraries
RUN pip install --upgrade pip && \
    pip install pandas numpy matplotlib seaborn scikit-learn xgboost jupyterlab

WORKDIR /workspace