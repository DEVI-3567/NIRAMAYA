import java.util.*;

public class Dijkstra {

    static class Node implements Comparable<Node> {
        int vertex;
        int distance;

        Node(int v, int d) {
            vertex = v;
            distance = d;
        }

        public int compareTo(Node other) {
            return this.distance - other.distance;
        }
    }

    public static void dijkstra(int V, List<List<Node>> adj, int source) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);

        PriorityQueue<Node> pq = new PriorityQueue<>();
        dist[source] = 0;
        pq.add(new Node(source, 0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.vertex;

            for (Node neighbor : adj.get(u)) {
                int v = neighbor.vertex;
                int weight = neighbor.distance;

                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.add(new Node(v, dist[v]));
                }
            }
        }

        // Print shortest distances
        System.out.println("Vertex \t Distance from Source");
        for (int i = 0; i < V; i++) {
            System.out.println(i + " \t\t " + dist[i]);
        }
    }

    public static void main(String[] args) {
        int V = 5; // number of vertices

        List<List<Node>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) {
            adj.add(new ArrayList<>());
        }

        // Adding edges (u -> v with weight)
        adj.get(0).add(new Node(1, 10));
        adj.get(0).add(new Node(4, 5));

        adj.get(1).add(new Node(2, 1));
        adj.get(1).add(new Node(4, 2));

        adj.get(2).add(new Node(3, 4));

        adj.get(3).add(new Node(2, 6));
        adj.get(3).add(new Node(0, 7));

        adj.get(4).add(new Node(1, 3));
        adj.get(4).add(new Node(2, 9));
        adj.get(4).add(new Node(3, 2));

        int source = 0;
        dijkstra(V, adj, source);
    }
}
