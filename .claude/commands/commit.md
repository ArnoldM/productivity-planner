# Commit Command

Create a git commit following project conventions.

## Instructions

Follow these steps to create a proper commit:

1. **Check staged files**: Run `git status` to see what files are staged for commit
2. **Review changes**: Run `git diff --staged` to see the actual changes that will be committed
3. **Check commit history**: Run `git log -5 --oneline` to understand the commit message style
4. **Analyze staged changes**: Determine the appropriate commit type based ONLY on staged files
5. **Create commit message**:
   - Keep it concise and focused on the change
   - Use Conventional Commits format with appropriate prefix:
     - `feat:` - New features
     - `fix:` - Bug fixes
     - `refactor:` - Code refactoring
     - `test:` - Adding or updating tests
     - `docs:` - Documentation changes
     - `chore:` - Maintenance tasks
     - `style:` - Code formatting (not CSS)
     - `perf:` - Performance improvements
   - **NEVER include AI references** (Claude, AI-generated, etc.)
   - Example: `feat: add task creation to workday page`
6. **Execute commit**: Create the commit with the message

## Important Rules

- ✅ Only commit staged files
- ✅ Message must be concise (1 line preferred)
- ✅ No AI/Claude/automation references
- ✅ Follow Conventional Commits format
- ❌ Don't add extra metadata or footers
- ❌ Don't commit unstaged files
