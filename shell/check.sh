#!/bin/bash

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GRAY='\033[0;90m'
NC='\033[0m' 

check_tool() {
    local name=$1
    local cmd=$2
    local args=$3
    local install_cmd=$4

    echo -e "${CYAN}Checking for $name...${NC}"

    if command -v "$cmd" >/dev/null 2>&1; then
        version=$($cmd $args)
        version_trimmed=$(echo "$version" | xargs)
        echo -e "${GREEN}✓ $name is installed (Version: $version_trimmed)${NC}"
    else
        echo -e "${YELLOW}✗ $name is not installed.${NC}"
        
        if [ -n "$install_cmd" ]; then
            read -p "Would you like to download and install it? [Y/n] " choice
            choice=${choice:-Y}

            if [[ "$choice" =~ ^[Yy]$ ]]; then
                echo -e "${CYAN}Installing $name...${NC}"
                eval "$install_cmd"
            else
                echo -e "${GRAY}Skipping installation of $name.${NC}"
            fi
        fi
    fi
    echo ""
}

check_tool "Bun"     "bun"  "-v"        "curl -fsSL https://bun.sh/install | bash"
check_tool "Node.js" "node" "--version" "curl -fsSL https://fnm.vercel.app/install | bash"
check_tool "npm"     "npm"  "--version" ""
