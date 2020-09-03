build:
	cd client && npm i && npm run build
	cd ..
	docker-compose build
start:
	docker-compose up -d
	sleep 5
	open http://localhost:3000
stop:
	docker-compose stop
refresh:
	docker-compose down
	docker-compose up -d --build
destroy:
	docker-compose down --rmi all --volumes --remove-orphans