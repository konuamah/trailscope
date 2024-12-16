FROM python:3.10-slim

# Install system dependencies and GDAL
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    postgresql-client \
    python3-gdal \
    gcc \
    g++ \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set GDAL environment variables
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Set work directory
WORKDIR /app

# Copy and install requirements
COPY requirements.txt .

# Install GDAL before other requirements
RUN pip install --no-cache-dir wheel setuptools
RUN pip install --no-cache-dir GDAL==$(gdal-config --version)
# Install remaining requirements
RUN sed -i '/^GDAL$/d' requirements.txt && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]