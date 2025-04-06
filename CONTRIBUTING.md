# Contributing Guide

saas-starter-ko actively encourages contributions. If you have any bugs or ideas for new features, please post them in the issues.
  
## VISION
saas-starter-ko is an open-source template designed to help developers build Software as a Service (SaaS) applications quickly and efficiently. We value the following principles:
- **Development speed**: Minimize repetitive work and support faster development cycles
- **Expandability**: Provides scalable architecture from small projects to large applications
- **Modularity**: Aimed for a modular design that allows you to selectively use only the features you need
- **Accessibility**: Make it accessible to developers of all levels, from beginners to professionals

## What We Embrace
- **Keep the codebase structure simple**. SaaS developers should be able to easily add and modify features.
- **Aim for modularity**. Although not yet implemented, add modules to the 'packages' folder (e.g., MFA, Email notifications, Editor, etc.).
- **Only add necessary dependencies**. This prevents the project from becoming bloated.
- **Avoid excessive abstraction**. Stay away from patterns that increase unnecessary complexity.

## Contribution Process

Please follow these steps to contribute to this open-source project.

### 1. Setup

- [Fork](https://github.com/kych0912/saas-starter-ko/fork) the repository
- Clone the repository by using this command:

```bash
git clone https://github.com/<your_github_username>/saas-starter-ko.git
```

### 2. Go to the project folder

```bash
cd saas-starter-ko
```

### 3. Configure Upstream Remote
```bash
git remote add upstream git@github.com:kych0912/saas-starter-ko.git

# Verify your remotes
git remote -v
```

### 4. Keep Your Fork Updated
- Before creating a new feature branch, ensure your fork's main branch is up to date:
```bash
# Switch to main branch
git checkout main

# Fetch upstream changes
git fetch upstream

# Rebase your main branch on top of upstream main
git rebase upstream/main

# Update your fork on GitHub
git push origin main
```

### 5. Create a Feature Branch
- Please make the branch in the following structure:
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
```

### 6. Commit Your Changes
- Please make the commit as follows:
```bash
# Commit with a clear message
git commit -m "feat: add new feature X"
```

### 7. Update Your Feature Branch
- Before submitting your PR, please update your feature branch:
```bash
# Fetch upstream changes
git fetch upstream

# Rebase your feature branch
git checkout feature/your-feature-name
git rebase upstream/main
```

### 8. Push to Your Fork
```bash
# Push your feature branch to your fork
git push origin feature/your-feature-name
```

### 9. Create a Pull Request
-  Fill in the PR template with:
    - Clear description of your changes
    - Any related issues
    - Testing steps if applicable

### 10. Review Process
1. Maintainers will review your PR
2. Address any feedback by:
   - Making requested changes
   - Pushing new commits to your feature branch
   - The PR will automatically update
3. Once approved, maintainers will merge your PR
