install:
	npm install

publish:
	npm publish --dry-run

lint:
	npx eslint .

build:
	rm -rf dist
	NODE_ENV=production npx webpack

