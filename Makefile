up:
	docker-compose --env-file ./.env up -d --build

down: 
	docker-compose down

up-prod:
	docker build --target production -t icar_report_manager .

up-prod-local:
	npm run build && docker-compose --env-file ./.env  -f docker-compose.yml -f docker-compose.prod.yml up -d --build 