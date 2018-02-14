# Use an official Python runtime as a parent image
FROM cassandra:latest

# Set the working directory to /app
WORKDIR /data

# Copy the current directory contents into the container at /app
ADD . ${WORKDIR}
ADD ./events-db events-db/
ADD ./routes routes/

# Make port 80 available
EXPOSE 9042
EXPOSE 7000
EXPOSE 7001
EXPOSE 7199
EXPOSE 9160

ENV CASSANDRA_CLUSTER_NAME
ENV CASSANDRA_SEEDS
ENV CASSANDRA_BROADCAST_ADDRESS

# Install any needed packages specified in package.json
RUN npm install

# Run NPM start to start instance
CMD ["npm", "start"]