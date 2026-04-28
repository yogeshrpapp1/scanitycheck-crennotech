# Use the official .NET 8 SDK image as the build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0

# Set the working directory inside the container
WORKDIR /app

# Configure the ASP.NET Core app to listen on port 8080
ENV ASPNETCORE_URLS=http://+:8080

# Copy the project file(s) first to leverage Docker layer caching for restore
COPY *.csproj ./
RUN dotnet restore

# Copy everything
COPY . ./

ARG ZAP_VERSION
ARG NUCLEI_VERSION=3.3.9

RUN apt-get update && \
    apt-get install -y wget curl unzip default-jre && \
    wget https://github.com/zaproxy/zaproxy/releases/download/v${ZAP_VERSION}/ZAP_${ZAP_VERSION}_Linux.tar.gz && \
    tar -xvzf ZAP_${ZAP_VERSION}_Linux.tar.gz -C /opt && \
    rm ZAP_${ZAP_VERSION}_Linux.tar.gz && \
    chmod +x /opt/ZAP_${ZAP_VERSION}/zap.sh && \
    wget https://github.com/projectdiscovery/nuclei/releases/download/v${NUCLEI_VERSION}/nuclei_${NUCLEI_VERSION}_linux_amd64.zip && \
    unzip nuclei_${NUCLEI_VERSION}_linux_amd64.zip && \
    mv nuclei /usr/local/bin/nuclei && \
    chmod +x /usr/local/bin/nuclei && \
    rm nuclei_${NUCLEI_VERSION}_linux_amd64.zip && \
    nuclei -version && \
    nuclei -update-templates || true

# Set persistent ENV inside the image
ENV ZAP_INSTALLED_VERSION=${ZAP_VERSION}

# Expose the port the API will run on
EXPOSE 8080

# Run the application and listen on all network interfaces at port 8080
ENTRYPOINT ["dotnet", "run", "--urls", "http://0.0.0.0:8080"]