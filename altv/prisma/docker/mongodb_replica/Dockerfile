FROM mongo:5

# Replace ENTRYPOINT with CMD to better handle init process
ENTRYPOINT mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip 0.0.0.0 & MONGOD_PID=$!; \
  # Wait for Mongo to be ready
  while ! mongo --quiet --port $MONGO_REPLICA_PORT --eval "db.stats()"; do sleep 1; done; \
  # Check if replica set is already configured and initiate if not
  INIT_REPL_CMD="if (!rs.status().ok) rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] })"; \
  # Check if root user exists and create if not
  INIT_USER_CMD="if (!db.getUser('$MONGO_INITDB_ROOT_USERNAME')) db.createUser({ user: '$MONGO_INITDB_ROOT_USERNAME', pwd: '$MONGO_INITDB_ROOT_PASSWORD', roles: ['root'] })"; \
  # Execute the commands
  until mongo admin --port $MONGO_REPLICA_PORT --eval "$INIT_REPL_CMD" && mongo admin --port $MONGO_REPLICA_PORT --eval "$INIT_USER_CMD"; do sleep 1; done; \
  # Output status and wait for mongod to exit
  echo "REPLICA SET ONLINE"; wait $MONGOD_PID;
