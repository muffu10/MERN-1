# AWS Cloud-Based Secure VM Communication and File Transfer

## Objective

Create a cloud-based environment where two virtual machines communicate securely within a virtual network and transfer files securely while maintaining proper access permissions.

---

# Technologies Used

- AWS EC2
- AWS VPC
- Security Groups
- SSH
- SCP
- Linux File Permissions

---

# Architecture

- One VPC
- One Public Subnet
- Two EC2 Instances
  - VM1 (Sender)
  - VM2 (Receiver)
- Secure communication using Private IPs
- File transfer using SCP over SSH

---

# STEP 1 — Login to AWS

Open AWS Console:

https://console.aws.amazon.com

Search for:
- EC2
- VPC

---

# STEP 2 — Create a VPC

1. Open VPC Dashboard
2. Click **Create VPC**

Settings:

- Name: `MyVPC`
- IPv4 CIDR block: `10.0.0.0/16`

Click **Create VPC**

---

# STEP 3 — Create a Subnet

1. Open Subnets
2. Click **Create Subnet**

Settings:

- VPC: `MyVPC`
- Subnet Name: `PublicSubnet`
- CIDR Block: `10.0.1.0/24`

Click **Create Subnet**

---

# STEP 4 — Create an Internet Gateway

1. Open Internet Gateways
2. Click **Create Internet Gateway**

Settings:

- Name: `MyIGW`

After creation:
1. Select Internet Gateway
2. Click **Actions → Attach to VPC**
3. Select `MyVPC`

---

# STEP 5 — Create Route Table

1. Open Route Tables
2. Click **Create Route Table**

Settings:

- Name: `MyRouteTable`
- VPC: `MyVPC`

After creation:

## Add Route

1. Select Route Table
2. Go to **Routes**
3. Click **Edit Routes**
4. Add:

| Destination | Target |
|---|---|
| 0.0.0.0/0 | Internet Gateway |

Save changes.

## Associate Subnet

1. Go to **Subnet Associations**
2. Click **Edit Associations**
3. Select `PublicSubnet`

Save associations.

---

# STEP 6 — Create Security Group

1. Open EC2 Dashboard
2. Open Security Groups
3. Click **Create Security Group**

Settings:

- Name: `VM-SG`
- Description: Security group for VMs
- VPC: `MyVPC`

## Inbound Rules

| Type | Port | Source |
|---|---|---|
| SSH | 22 | My IP |

Click **Create Security Group**

---

# STEP 7 — Launch VM1

1. Open EC2 Dashboard
2. Click **Launch Instance**

Settings:

- Name: `VM1`
- AMI: Ubuntu Server
- Instance Type: `t2.micro`
- Key Pair: Create or select existing `.pem` key
- Network:
  - VPC: `MyVPC`
  - Subnet: `PublicSubnet`
  - Auto Assign Public IP: Enable
- Security Group:
  - Select `VM-SG`

Click **Launch Instance**

---

# STEP 8 — Launch VM2

Repeat the same process.

Settings:

- Name: `VM2`
- Same VPC
- Same Subnet
- Same Security Group

Launch instance.

---

# STEP 9 — Connect to EC2 Instances

Move key file:

```bash
mv mykey.pem ~/.ssh/
chmod 400 ~/.ssh/mykey.pem
```

Connect to VM1:

```bash
ssh -i ~/.ssh/mykey.pem ubuntu@VM1_PUBLIC_IP
```

Connect to VM2:

```bash
ssh -i ~/.ssh/mykey.pem ubuntu@VM2_PUBLIC_IP
```

---

# STEP 10 — Verify Secure Communication

Inside VM1:

```bash
ping VM2_PRIVATE_IP
```

Successful replies confirm private communication inside the VPC.

---

# STEP 11 — Create a File on VM1

Inside VM1:

```bash
echo "Hello from VM1" > test.txt
```

Verify:

```bash
cat test.txt
```

---

# STEP 12 — Copy PEM Key to VM1

From local machine:

```bash
scp -i ~/.ssh/mykey.pem ~/.ssh/mykey.pem ubuntu@VM1_PUBLIC_IP:/home/ubuntu/
```

SSH into VM1 again:

```bash
ssh -i ~/.ssh/mykey.pem ubuntu@VM1_PUBLIC_IP
```

Set permission:

```bash
chmod 400 mykey.pem
```

---

# STEP 13 — Transfer File from VM1 to VM2

Inside VM1:

```bash
scp -i mykey.pem test.txt ubuntu@VM2_PRIVATE_IP:/home/ubuntu/
```

This securely transfers the file using SCP over SSH.

---

# STEP 14 — Verify File on VM2

SSH into VM2:

```bash
ssh -i ~/.ssh/mykey.pem ubuntu@VM2_PUBLIC_IP
```

Check file:

```bash
cat test.txt
```

Expected Output:

```bash
Hello from VM1
```

---

# STEP 15 — Apply File Permissions

Inside VM2:

```bash
chmod 600 test.txt
```

Check permissions:

```bash
ls -l
```

Meaning:
- Owner can read/write
- Others cannot access file

---

# Security Features Implemented

## 1. Virtual Private Cloud (VPC)
Provides isolated cloud network.

## 2. Security Groups
Restricts SSH access to trusted IP only.

## 3. SSH Encryption
Secure remote login.

## 4. SCP Secure Transfer
Encrypted file transfer between VMs.

## 5. Linux File Permissions
Protects unauthorized file access.

---

# Important Commands Summary

## SSH into Instance

```bash
ssh -i mykey.pem ubuntu@PUBLIC_IP
```

## Ping Another VM

```bash
ping PRIVATE_IP
```

## Create File

```bash
echo "Hello" > test.txt
```

## Transfer File

```bash
scp -i mykey.pem test.txt ubuntu@PRIVATE_IP:/home/ubuntu/
```

## Change File Permission

```bash
chmod 600 test.txt
```

---

# Result

Successfully created a secure cloud environment using AWS where:

- Two virtual machines communicate privately inside a VPC
- Files are transferred securely using SCP
- Access permissions are properly managed using Linux permissions and Security Groups

---

# Optional Improvements

- Use Private Subnet for VM2
- Configure Bastion Host
- Use IAM Roles
- Use S3 Bucket for centralized storage
- Configure NACLs for extra security

---
