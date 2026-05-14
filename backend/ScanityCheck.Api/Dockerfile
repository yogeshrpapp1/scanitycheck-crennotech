# --- Stage 1: Download ZAP ---
FROM debian:trixie-slim AS zap-downloader
ARG ZAP_VERSION
RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/zaproxy/zaproxy/releases/download/v${ZAP_VERSION}/ZAP_${ZAP_VERSION}_Linux.tar.gz && \
    tar -xvzf ZAP_${ZAP_VERSION}_Linux.tar.gz -C /opt

# --- Stage 2: Download Nuclei ---
FROM debian:trixie-slim AS nuclei-downloader
ARG NUCLEI_VERSION
RUN apt-get update && apt-get install -y wget unzip && \
    wget https://github.com/projectdiscovery/nuclei/releases/download/v${NUCLEI_VERSION}/nuclei_${NUCLEI_VERSION}_linux_amd64.zip && \
    unzip nuclei_${NUCLEI_VERSION}_linux_amd64.zip

# --- Stage 3: Build .NET App ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-builder
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o /publish
# Note: In production, use 'dotnet publish' here

# --- Stage 4: Final production image ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

ARG ZAP_VERSION
ARG NUCLEI_VERSION

# 1. Install runtime dependencies
RUN apt-get update && \
    apt-get install -y default-jre curl && \
    rm -rf /var/lib/apt/lists/*

# 2. Copy tools from earlier stages
COPY --from=zap-downloader /opt /opt
COPY --from=nuclei-downloader /nuclei /usr/local/bin/nuclei
RUN chmod +x /opt/ZAP_${ZAP_VERSION}/zap.sh && \
    chmod +x /usr/local/bin/nuclei

# 3. Copy /publish from builder stage
COPY --from=dotnet-builder /publish .

# 4. Set environment variables
ENV ZAP_INSTALLED_VERSION=${ZAP_VERSION}
ENV NUCLEI_INSTALLED_VERSION=${NUCLEI_VERSION}
ENV ASPNETCORE_URLS=http://+:8080

# 5. Final validation and template update
RUN nuclei -version && \
    mkdir -p /opt/nuclei-templates && \
    (nuclei -update-templates || true) && \
    if [ -d "/root/nuclei-templates" ]; then \
        cp -r /root/nuclei-templates/* /opt/nuclei-templates/ && \
        rm -rf /root/nuclei-templates; \
    fi && \
    chmod -R 755 /opt/nuclei-templates

EXPOSE 8080
ENTRYPOINT ["dotnet", "ScanityCheck.Api.dll", "--urls", "http://0.0.0.0:8080"]