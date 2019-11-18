# The Black Clothes Comfortability Index
This is a static site that consults a lambda to determine the comfort index for a given location at that time. The lambda hits the Dark Sky API and does some custom logic to determine how comoftable it would be to wear black clothes.


## Deploying the static site
```
aws s3 cp index.html s3://black-clothes-comfortability
aws s3api put-object-acl --bucket black-clothes-comfortability --key index.html --acl public-read
```

## Deploying the lambda
```
sls deploy
```

