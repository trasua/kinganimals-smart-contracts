# Kinganimals

## Migration
Create a .env file (it must be gitignored) containing something like

```
export PRIVATE_KEY_MAINNET=4E7FECCB71207B867C495B51A9758B104B1D4422088A87F4978BE64636656243
```

Then, run the migration with:
```
source .env && tronbox migrate --network mainnet
```