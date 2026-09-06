# Branch Protection Setup

These are GitHub repo settings, not files — configure once, before the whole team starts pushing.

**Branching model:** feature branches (e.g. `feature/frontend/andrews`) → PR into `develop` → validate on `develop` → PR from `develop` into `main`. Both `develop` and `main` get protection rules; `main` should always reflect what's actually working.

**Where:** repo → Settings → Branches → Add branch protection rule

---

## Rule 1 — `develop`

Branch name pattern: `develop`

- [ ] Require a pull request before merging (1 approval)
- [ ] Require status checks to pass before merging — select `Frontend CI / build-and-lint` and `Backend CI / build-and-lint` (these only appear after the workflows have run at least once)
- [ ] Require branches to be up to date before merging

## Rule 2 — `main`

Branch name pattern: `main`

- [ ] Require a pull request before merging (1 approval)
- [ ] Require status checks to pass before merging — same two checks
- [ ] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings (applies to everyone, including admins)

---

## Suggested workflow for the team

1. Branch off `develop`: `git checkout -b feature/frontend/andrews develop`
2. Push, open a PR into `develop`
3. CI runs automatically, based on whether you touched `frontend/` or `backend/`
4. Get one approval, merge into `develop`
5. Periodically, once `develop` is checked and stable, open a PR from `develop` into `main` to promote it
