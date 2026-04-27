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

# Install Java and ZAP (v2.17.0)
RUN apt-get update && \
    apt-get install -y wget default-jre && \
    wget https://github.com/zaproxy/zaproxy/releases/download/v2.17.0/ZAP_2.17.0_Linux.tar.gz && \
    tar -xvzf ZAP_2.17.0_Linux.tar.gz -C /opt && \
    rm ZAP_2.17.0_Linux.tar.gz

# Set ZAP path env variable
ENV ZAP_PATH=/opt/ZAP_2.17.0/zap.sh

# Expose the port the API will run on
EXPOSE 8080

# Run the application and listen on all network interfaces at port 8080
ENTRYPOINT ["dotnet", "run", "--urls", "http://0.0.0.0:8080"]