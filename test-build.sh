#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting incremental Docker build test...${NC}"

# Test common-setup stage
echo -e "${YELLOW}Testing common-setup stage...${NC}"
if docker build --progress=plain --target common-setup -f Dockerfile.prod -t altv-common-test .; then
    echo -e "${GREEN}✓ common-setup stage built successfully${NC}"
else
    echo -e "${RED}✗ common-setup stage failed${NC}"
    exit 1
fi

# Test build-main stage
echo -e "${YELLOW}Testing build-main stage...${NC}"
if docker build --progress=plain --target build-main -f Dockerfile.prod -t altv-main-test .; then
    echo -e "${GREEN}✓ build-main stage built successfully${NC}"
else
    echo -e "${RED}✗ build-main stage failed${NC}"
    exit 1
fi

# Test build-webview stage
echo -e "${YELLOW}Testing build-webview stage...${NC}"
if docker build --progress=plain --target build-webview -f Dockerfile.prod -t altv-webview-test .; then
    echo -e "${GREEN}✓ build-webview stage built successfully${NC}"
else
    echo -e "${RED}✗ build-webview stage failed${NC}"
    exit 1
fi

# Test db-migration stage
echo -e "${YELLOW}Testing db-migration stage...${NC}"
if docker build --progress=plain --target db-migration -f Dockerfile.prod -t altv-migration-test .; then
    echo -e "${GREEN}✓ db-migration stage built successfully${NC}"
else
    echo -e "${RED}✗ db-migration stage failed${NC}"
    exit 1
fi

# Test final runtime stage
echo -e "${YELLOW}Testing final runtime stage...${NC}"
if docker build --progress=plain -f Dockerfile.prod -t altv-rift-test .; then
    echo -e "${GREEN}✓ Final image built successfully${NC}"
else
    echo -e "${RED}✗ Final image build failed${NC}"
    exit 1
fi

echo -e "${GREEN}All stages built successfully!${NC}"

# Optional: Run container to test
echo -e "${YELLOW}Would you like to run the container for testing? (y/n)${NC}"
read -r run_container

if [[ $run_container == "y" ]]; then
    echo -e "${YELLOW}Running container...${NC}"
    docker run --rm -it altv-rift-test
fi 