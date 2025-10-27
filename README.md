Node reverse proxy, No packages will be used.

**Build and Install**

1. Install [Node](https://nodejs.org/en/download)
2. Run `npm install`
3. Run `node --experimental-strip-types --watch index.ts` to run on watch mode

**References:**

- [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Caddy](https://github.com/caddyserver/caddy)
- [Cloudflare Article](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/)
- [GFG](https://www.geeksforgeeks.org/computer-networks/what-is-a-reverse-proxy/)

**Steps:**

1. Add redirection logic:

For a given request, redirect it to the mapped server and return
the response to the client

2. Add a configuration parser:

From the first step, the request/server map is hardcoded, in the second step the
user must be able to write and yaml config that will be readed at the reverse
proxy build process.

3. Configure cluster mode:

In NodeJS there is an api called `cluster`, this api enables the creation of
multiple Node instances, they can distribute the workload between them. The user
must be able to choose how many instances will be created.

4. Configure worker thread mode:

In NodeJS there is an api called `workers`, this api enables the creation of
multiple threads in a single instance, this threads share the same memory space.
The user must be able to choose if he wants the cluster or thread mode, and how
many threads will be created in the thread mode.

5. Add load balancer:

_I will think about this description later_

6. Cache response:

_I will think about this description later_

7. Authorization:

_I will think about this description later, this is simple but quite boring_
