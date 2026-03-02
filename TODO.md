# DigiLab Web - TODO

## Setup Required

### GitHub Action for Roadmap Sync

The roadmap sync from digilab-app is configured but needs a Personal Access Token to work.

**Steps:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope (full control of private repositories)
3. Copy the token
4. Go to https://github.com/lopezmichael/digilab-app/settings/secrets/actions
5. Click "New repository secret"
6. Name: `DIGILAB_WEB_TOKEN`
7. Value: paste the token
8. Save

**Test the workflow:**
1. Make a small edit to `data/public-roadmap.yaml` in digilab-app
2. Push to main
3. Check Actions tab to see if sync runs
4. Verify change appears in digilab-web's `src/data/roadmap.yaml`

**Files involved:**
- Source: `digilab-app/data/public-roadmap.yaml`
- Workflow: `digilab-app/.github/workflows/sync-roadmap.yml`
- Destination: `digilab-web/src/data/roadmap.yaml`
