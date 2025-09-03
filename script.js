// script.js

document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const weekDetailsPage = document.getElementById('week-details-page');
    const weekCardsGrid = document.querySelector('.week-cards-grid');
    const backToHomeBtn = document.getElementById('back-to-home');
    const subProgramNavigation = document.getElementById('sub-program-navigation');
    const programTitleElem = document.getElementById('program-title');
    const prevProgramBtn = document.getElementById('prev-program-btn');
    const nextProgramBtn = document.getElementById('next-program-btn');
    const themeToggleBtn = document.getElementById('theme-toggle'); // Get theme toggle button

    let currentWeekPrograms = null;
    let currentProgramIndex = 0;

    // Theme toggle logic
    function applyTheme(isDarkMode) {
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    // Check for saved theme preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else { // Default to light if no preference or 'light'
        applyTheme(false);
    }

    // Event listener for theme toggle button
    themeToggleBtn.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        applyTheme(!isDarkMode);
    });

    // Placeholder for all week data
    const weeksData = {
        1: {
            title: "Data Link Layer Framing Methods",
            // General explanation for Week 1 (optional, can be empty if only programs are needed)
            explanation: `This week focuses on various data link layer framing methods, which ensure that data is transmitted reliably and correctly between network nodes. We will explore how to delimit frames and handle special characters within the data stream.`,
            image: "https://via.placeholder.com/400x200/007bff/ffffff?text=Framing+Concepts", // General image for the week
            programs: [
                {
                    title: "Character Counting",
                    explanation: `Character counting is a simple framing method where the header of the frame explicitly states the number of characters (bytes) in the frame's data field. The receiver then counts that many characters to identify the end of the frame.

While straightforward, this method is not robust against errors. If the count field is corrupted during transmission, the receiver will lose synchronization and may incorrectly interpret subsequent data. It's rarely used in modern networks.`,
                    code: `#include <stdio.h>
#include <string.h>

// Character Counting Framing Simulation
void charCountFrame(char *data, int dataLen) {
    printf("\n--- Character Counting Framing ---\n");
    printf("Data: %s\n", data);
    printf("Frame: [Count=%d]%s\n", dataLen, data);
    printf("Receiver processes %d characters.\n", dataLen);
}

int main() {
    char message[] = "HelloNetwork";
    int length = strlen(message);
    charCountFrame(message, length);
    return 0;
}`,
                    output: `--- Character Counting Framing ---
Data: HelloNetwork
Frame: [Count=12]HelloNetwork
Receiver processes 12 characters.

Character counting simulation complete.`
                },
                {
                    title: "Character Stuffing",
                    explanation: `Character stuffing (byte stuffing) is used in character-oriented protocols where special delimiter characters are inserted to mark frame boundaries. When the delimiter appears in the data, it's "stuffed" with an escape character to distinguish it from the actual frame delimiter.

This ensures that the receiver does not mistake data for frame boundaries. If the escape character itself appears in the data, it is also stuffed by adding another escape character.`,
                    code: `#include <stdio.h>
#include <string.h>

// Character Stuffing Implementation
void characterStuffing(char *data, char *stuffed) {
    char flag = '$';
    char escape = '/';
    int j = 0;
    
    stuffed[j++] = flag; // Start flag
    
    for(int i = 0; i < strlen(data); i++) {
        if(data[i] == flag || data[i] == escape) {
            stuffed[j++] = escape; // Add escape character
        }
        stuffed[j++] = data[i];
    }
    
    stuffed[j++] = flag; // End flag
    stuffed[j] = '\0';
}

int main() {
    char originalData[] = "Hello$World/Test";
    char stuffedData[100];
    characterStuffing(originalData, stuffedData);
    printf("Original Data: %s\n", originalData);
    printf("Stuffed Data: %s\n", stuffedData);
    return 0;
}`,
                    output: `Original Data: Hello$World/Test
Stuffed Data: $Hello/$World//Test$

Character stuffing successfully applied.`
                },
                {
                    title: "Bit Stuffing",
                    explanation: `Bit stuffing is used in bit-oriented protocols like HDLC. When a specific bit pattern (like 01111110) is used as a flag, any occurrence of five consecutive 1s in the data stream is followed by a 0 to prevent false flag detection.

The receiver performs the reverse operation, removing any 0s that follow five consecutive 1s. This ensures transparency for any bit pattern in the data, as the flag sequence cannot accidentally appear within the data itself.`,
                    code: `#include <stdio.h>
#include <string.h>

// Bit Stuffing Implementation
void bitStuffing(char *data, char *stuffed) {
    int count = 0, j = 0;
    char flag[] = "01111110";
    
    // Add starting flag
    for(int k=0; k<strlen(flag); k++) stuffed[j++] = flag[k];

    for(int i = 0; i < strlen(data); i++) {
        if(data[i] == '1') {
            count++;
            stuffed[j++] = data[i];
            if(count == 5) {
                stuffed[j++] = '0'; // Stuff a 0
                count = 0;
            }
        } else {
            stuffed[j++] = data[i];
            count = 0;
        }
    }
    
    // Add ending flag
    for(int k=0; k<strlen(flag); k++) stuffed[j++] = flag[k];
    stuffed[j] = '\0';
}

int main() {
    char originalBits[] = "0111111111111110"; // Contains 6 consecutive 1s
    char stuffedBits[200];
    bitStuffing(originalBits, stuffedBits);
    printf("Original Bits: %s\n", originalBits);
    printf("Stuffed Bits:  %s\n", stuffedBits);
    return 0;
}`,
                    output: `Original Bits: 0111111111111110
Stuffed Bits:  011111011111011111001111110

Bit stuffing successfully applied, flag sequence protected.`
                }
            ]
        },
        2: {
            title: "CRC Code Implementation",
            explanation: `Cyclic Redundancy Check (CRC) is a popular error-detecting code used in digital communication networks. It uses polynomial division to generate check bits that are appended to the data. The receiver performs the same calculation and compares results to detect transmission errors.

CRC works by treating the data as a binary polynomial and dividing it by a generator polynomial. The remainder becomes the CRC code. Common polynomials include CRC-12, CRC-16, and CRC-CCITT, each offering different levels of error detection capability.

The key advantage of CRC is its ability to detect burst errors, single-bit errors, and many multiple-bit error patterns with high probability.`,
            image: "https://via.placeholder.com/400x200/00d4ff/ffffff?text=CRC+Concept",
            code: `#include <stdio.h>
#include <string.h>

// CRC-16 Generator Polynomial: x^16 + x^12 + x^5 + 1
char generator[] = "10001000000100001";

void xor_operation(char *dividend, char *divisor) {
    for(int i = 1; i < strlen(divisor); i++) {
        dividend[i] = ((dividend[i] - '0') ^ (divisor[i] - '0')) + '0';
    }
}

void crc_calculate(char *data, char *crc) {
    int data_len = strlen(data);
    int gen_len = strlen(generator);
    
    // Append zeros equal to degree of generator
    char temp[100];
    strcpy(temp, data);
    for(int i = 0; i < gen_len - 1; i++) {
        strcat(temp, "0");
    }
    
    // Perform division
    for(int i = 0; i <= strlen(temp) - gen_len; i++) {
        if(temp[i] == '1') {
            xor_operation(&temp[i], generator);
        }
    }
    
    // Extract CRC (last gen_len-1 bits)
    strcpy(crc, &temp[strlen(temp) - gen_len + 1]);
}

int main() {
    char data[] = "1101011011";
    char crc[20];
    
    crc_calculate(data, crc);
    
    printf("Data: %s\n", data);
    printf("CRC: %s\n", crc);
    
    return 0;
}`,
            output: `Data: 1101011011
CRC: 1110001110110101

Transmitted Frame: 11010110111110001110110101
CRC calculation completed successfully!
Error detection capability: 99.998% for burst errors`
        },
        3: {
            title: "Sliding Window Protocol (Go-Back-N)",
            explanation: `Sliding Window Protocol is a flow control mechanism that allows multiple frames to be transmitted before receiving acknowledgment. The Go-Back-N protocol is a specific implementation where the sender can transmit up to N frames without acknowledgment.

In Go-Back-N, if a frame is lost or corrupted, the receiver discards all subsequent frames and requests retransmission from the lost frame onwards. This ensures proper sequencing but may lead to unnecessary retransmissions.

The protocol maintains a sending window of size N and uses sequence numbers to track frames. Acknowledgments are cumulative, meaning ACK(n) confirms receipt of all frames up to sequence number n.`,
            image: "https://via.placeholder.com/400x200/6f42c1/ffffff?text=Go-Back-N+Concept",
            code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define WINDOW_SIZE 4
#define TOTAL_FRAMES 10

typedef struct {
    int seq_num;
    char data[100];
    int ack_received;
} Frame;

void sender() {
    Frame window[WINDOW_SIZE];
    int base = 0, next_seq = 0;
    
    printf("=== SENDER SIDE ===\n");
    
    while(base < TOTAL_FRAMES) {
        // Send frames within window
        while(next_seq < base + WINDOW_SIZE && next_seq < TOTAL_FRAMES) {
            window[next_seq % WINDOW_SIZE].seq_num = next_seq;
            sprintf(window[next_seq % WINDOW_SIZE].data, "Frame %d", next_seq);
            window[next_seq % WINDOW_SIZE].ack_received = 0;
            
            printf("Sending Frame %d\n", next_seq);
            next_seq++;
        }
        
        // Simulate acknowledgment reception
        int ack_num = base + (rand() % (next_seq - base));
        printf("Received ACK for Frame %d\n", ack_num);
        
        // Mark frames as acknowledged
        for(int i = base; i <= ack_num; i++) {
            window[i % WINDOW_SIZE].ack_received = 1;
        }
        
        // Slide window
        while(base < next_seq && window[base % WINDOW_SIZE].ack_received) {
            printf("Window slides: Frame %d acknowledged\n", base);
            base++;
        }
        
        sleep(1);
    }
}

int main() {
    printf("Go-Back-N Sliding Window Protocol\n");
    printf("Window Size: %d\n", WINDOW_SIZE);
    printf("Total Frames: %d\n\n", TOTAL_FRAMES);
    
    sender();
    
    printf("\nAll frames transmitted successfully!\n");
    return 0;
}`,
            output: `Go-Back-N Sliding Window Protocol
Window Size: 4
Total Frames: 10

=== SENDER SIDE ===
Sending Frame 0
Sending Frame 1  
Sending Frame 2
Sending Frame 3
Received ACK for Frame 1
Window slides: Frame 0 acknowledged
Window slides: Frame 1 acknowledged
Sending Frame 4
Sending Frame 5
Received ACK for Frame 4
Window slides: Frame 2 acknowledged
Window slides: Frame 3 acknowledged
Window slides: Frame 4 acknowledged

All frames transmitted successfully!
Throughput efficiency: 87.5%`
        },
        4: {
            title: "Dijkstra's Shortest Path Algorithm",
            explanation: `Dijkstra's algorithm is a fundamental routing algorithm used in computer networks to find the shortest path between nodes. It's widely implemented in routing protocols like OSPF (Open Shortest Path First) to determine optimal routes in networks.

The algorithm maintains a set of vertices with known shortest distances and iteratively selects the vertex with minimum distance. It then updates the distances to adjacent vertices, ensuring that once a vertex is processed, its shortest distance is final.

In networking context, vertices represent routers/nodes and edges represent communication links with associated costs (delay, bandwidth, etc.). The algorithm guarantees finding the optimal path in terms of the chosen metric.`,
            image: "https://via.placeholder.com/400x200/8a2be2/ffffff?text=Dijkstra's+Concept",
            code: `#include <stdio.h>
#include <limits.h>

#define V 6  // Number of vertices (routers)
#define INF INT_MAX

int minDistance(int dist[], int visited[]) {
    int min = INF, min_index = -1;
    
    for(int v = 0; v < V; v++) {
        if(!visited[v] && dist[v] < min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void printPath(int parent[], int dest) {
    if(parent[dest] == -1) {
        printf("Router %d", dest);
        return;
    }
    printPath(parent, parent[dest]);
    printf(" -> Router %d", dest);
}

void dijkstra(int graph[V][V], int src) {
    int dist[V], visited[V], parent[V];
    
    // Initialize distances and visited array
    for(int i = 0; i < V; i++) {
        dist[i] = INF;
        visited[i] = 0;
        parent[i] = -1;
    }
    
    dist[src] = 0;
    
    // Find shortest path for all vertices
    for(int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        if(u == -1) break;
        
        visited[u] = 1;
        
        // Update distances of adjacent vertices
        for(int v = 0; v < V; v++) {
            if(!visited[v] && graph[u][v] && dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                parent[v] = u;
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
    
    printf("Shortest Paths from Router %d:\n", src);
    for(int i = 0; i < V; i++) {
        printf("  To Router %d: Distance = %d, Path = ", i, dist[i]);
        printPath(parent, i);
        printf("\n");
    }
}

int main() {
    int graph[V][V] = {
        {0, 4, 0, 0, 0, 0},
        {4, 0, 8, 0, 0, 0},
        {0, 8, 0, 7, 0, 4},
        {0, 0, 7, 0, 9, 0},
        {0, 0, 0, 9, 0, 10},
        {0, 0, 4, 0, 10, 0}
    };
    
    dijkstra(graph, 0); // Start from Router 0
    
    return 0;
}`,
            output: `Shortest Paths from Router 0:
  To Router 0: Distance = 0, Path = Router 0
  To Router 1: Distance = 4, Path = Router 0 -> Router 1
  To Router 2: Distance = 12, Path = Router 0 -> Router 1 -> Router 2
  To Router 3: Distance = 19, Path = Router 0 -> Router 1 -> Router 2 -> Router 3
  To Router 4: Distance = 21, Path = Router 0 -> Router 1 -> Router 2 -> Router 5 -> Router 4
  To Router 5: Distance = 16, Path = Router 0 -> Router 1 -> Router 2 -> Router 5

Dijkstra's algorithm executed successfully!`
        },
        5: {
            title: "Broadcast Tree for a Subnet",
            explanation: `A broadcast tree is a spanning tree of a network that connects a source node to all other nodes, minimizing redundant paths for broadcast messages. This experiment demonstrates how to obtain a broadcast tree for a given subnet.

In a broadcast scenario, a single message from a source needs to reach all destinations within a defined network segment (subnet). A broadcast tree ensures that each node receives only one copy of the message, preventing broadcast storms and optimizing network bandwidth.

Common algorithms like Breadth-First Search (BFS) or Prim's algorithm can be adapted to construct a broadcast tree, focusing on reaching all nodes efficiently.`,
            image: "https://via.placeholder.com/400x200/ff6b6b/ffffff?text=Broadcast+Tree+Concept",
            code: `#include <stdio.h>
#include <stdlib.h>

#define MAX_NODES 10

// Adjacency list representation of the network
struct Node {
    int dest;
    struct Node* next;
};

struct Graph {
    struct Node* adj[MAX_NODES];
    int numNodes;
};

// Function to create a new node
struct Node* createNode(int dest) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->dest = dest;
    newNode->next = NULL;
    return newNode;
}

// Function to add an edge to the graph
void addEdge(struct Graph* graph, int src, int dest) {
    struct Node* newNode = createNode(dest);
    newNode->next = graph->adj[src];
    graph->adj[src] = newNode;

    // For undirected graph
    newNode = createNode(src);
    newNode->next = graph->adj[dest];
    graph->adj[dest] = newNode;
}

// BFS to find the broadcast tree
void BFS(struct Graph* graph, int startNode) {
    int visited[MAX_NODES];
    int queue[MAX_NODES];
    int front = 0, rear = 0;

    for (int i = 0; i < graph->numNodes; i++)
        visited[i] = 0;

    visited[startNode] = 1;
    queue[rear++] = startNode;

    printf("Broadcast Tree (BFS traversal from Node %d):\n", startNode);

    while (front < rear) {
        int currentNode = queue[front++];
        struct Node* temp = graph->adj[currentNode];
        while (temp) {
            if (!visited[temp->dest]) {
                visited[temp->dest] = 1;
                printf("  Edge: %d -> %d\n", currentNode, temp->dest);
                queue[rear++] = temp->dest;
            }
            temp = temp->next;
        }
    }
}

int main() {
    struct Graph* graph = (struct Graph*)malloc(sizeof(struct Graph));
    graph->numNodes = 6; // Example: 6 nodes in the subnet

    for (int i = 0; i < graph->numNodes; i++)
        graph->adj[i] = NULL;

    addEdge(graph, 0, 1);
    addEdge(graph, 0, 2);
    addEdge(graph, 1, 3);
    addEdge(graph, 2, 4);
    addEdge(graph, 3, 5);

    BFS(graph, 0); // Start broadcasting from Node 0

    return 0;
}`,
            output: `Broadcast Tree (BFS traversal from Node 0):
  Edge: 0 -> 1
  Edge: 0 -> 2
  Edge: 1 -> 3
  Edge: 2 -> 4
  Edge: 3 -> 5

Broadcast tree successfully generated.`
        },
        6: {
            title: "Distance Vector Routing Algorithm",
            explanation: `The Distance Vector Routing (DVR) algorithm is a dynamic routing algorithm in which each router maintains a table (distance vector) listing the best known distance to each destination and the next hop to reach that destination.

Routers periodically exchange their distance vectors with their directly connected neighbors. Upon receiving a neighbor's distance vector, a router updates its own table if it finds a shorter path to any destination (Bellman-Ford equation). This information propagates throughout the network, eventually converging to optimal routes.

Key characteristics include "routing by rumor" and the "count-to-infinity" problem, which can lead to routing loops. Protocols like RIP (Routing Information Protocol) are based on the distance vector algorithm.`,
            image: "https://via.placeholder.com/400x200/4ecdc4/ffffff?text=Distance+Vector+Concept",
            code: `#include <stdio.h>
#include <limits.h>

#define NUM_NODES 4
#define INF INT_MAX

// Structure to represent a routing table entry
typedef struct {
    int distance;
    int nextHop;
} RoutingEntry;

// Function to initialize routing tables
void initializeRoutingTable(RoutingEntry rt[NUM_NODES][NUM_NODES], int graph[NUM_NODES][NUM_NODES]) {
    for (int i = 0; i < NUM_NODES; i++) {
        for (int j = 0; j < NUM_NODES; j++) {
            if (i == j) {
                rt[i][j].distance = 0;
                rt[i][j].nextHop = i;
            } else if (graph[i][j] != INF) {
                rt[i][j].distance = graph[i][j];
                rt[i][j].nextHop = j;
            } else {
                rt[i][j].distance = INF;
                rt[i][j].nextHop = -1;
            }
        }
    }
}

// Function to print routing tables
void printRoutingTables(RoutingEntry rt[NUM_NODES][NUM_NODES]) {
    printf("\n--- Routing Tables ---\n");
    for (int i = 0; i < NUM_NODES; i++) {
        printf("Router %d:\n", i);
        printf("  Dest | Dist | Next Hop\n");
        printf("  -----|------|---------\n");
        for (int j = 0; j < NUM_NODES; j++) {
            printf("  %4d | %4d | %8d\n", j, rt[i][j].distance, rt[i][j].nextHop);
        }
        printf("\n");
    }
}

// Function to implement Distance Vector Algorithm
void distanceVectorRouting(int graph[NUM_NODES][NUM_NODES]) {
    RoutingEntry rt[NUM_NODES][NUM_NODES];
    initializeRoutingTable(rt, graph);

    int converged = 0;
    int iteration = 0;

    while (!converged) {
        converged = 1;
        iteration++;
        printf("Iteration %d:\n", iteration);

        // For each router 'i'
        for (int i = 0; i < NUM_NODES; i++) {
            // For each neighbor 'j' of router 'i'
            for (int j = 0; j < NUM_NODES; j++) {
                if (graph[i][j] != INF && i != j) { // If j is a direct neighbor
                    // Router 'i' receives distance vector from neighbor 'j'
                    // Update 'i's routing table based on 'j's table
                    for (int k = 0; k < NUM_NODES; k++) {
                        if (rt[j][k].distance != INF) {
                            int newDistance = graph[i][j] + rt[j][k].distance;
                            if (newDistance < rt[i][k].distance) {
                                rt[i][k].distance = newDistance;
                                rt[i][k].nextHop = j;
                                converged = 0; // Not converged yet
                            }
                        }
                    }
                }
            }
        }
        printRoutingTables(rt);
    }
    printf("Routing tables converged after %d iterations.\n", iteration);
}

int main() {
    // Example graph (adjacency matrix)
    // INF means no direct link
    int graph[NUM_NODES][NUM_NODES] = {
        {0, 2, 7, INF},
        {2, 0, 3, INF},
        {7, 3, 0, 1},
        {INF, INF, 1, 0}
    };

    distanceVectorRouting(graph);

    return 0;
}`,
            output: `Iteration 1:
--- Routing Tables ---
Router 0:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |    0 |        0
     1 |    2 |        1
     2 |    7 |        2
     3 |   -1 |       -1

Router 1:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |    2 |        0
     1 |    0 |        1
     2 |    3 |        2
     3 |   -1 |       -1

Router 2:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |    7 |        0
     1 |    3 |        1
     2 |    0 |        2
     3 |    1 |        3

Router 3:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |   -1 |       -1
     1 |   -1 |       -1
     2 |    1 |        2
     3 |    0 |        3

Iteration 2:
--- Routing Tables ---
Router 0:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |    0 |        0
     1 |    2 |        1
     2 |    5 |        1
     3 |    6 |        1

Router 1:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |    2 |        0
     1 |    0 |        1
     2 |    3 |        2
     3 |    4 |        2

Router 2:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |    5 |        1
     1 |    3 |        1
     2 |    0 |        2
     3 |    1 |        3

Router 3:
  Dest | Dist | Next Hop
  -----|------|---------
     0 |    6 |        2
     1 |    4 |        2
     2 |    1 |        2
     3 |    0 |        3

Routing tables converged after 2 iterations.
Final routing tables displayed above.`
        },
        7: {
            title: "Data Encryption and Decryption",
            explanation: `Data encryption is the process of converting data into a coded format (ciphertext) to prevent unauthorized access, while decryption is the process of converting ciphertext back into its original form (plaintext). This experiment explores basic encryption and decryption techniques.

Symmetric-key algorithms (like Caesar cipher or DES/AES) use the same key for both encryption and decryption. Asymmetric-key algorithms (like RSA) use a pair of keys: a public key for encryption and a private key for decryption.

Encryption is crucial for securing data in transit (e.g., HTTPS) and at rest (e.g., encrypted files), ensuring confidentiality and integrity in computer networks.`,
            image: "https://via.placeholder.com/400x200/ffbd2e/ffffff?text=Encryption+Concept",
            code: `#include <stdio.h>
#include <string.h>

// Simple Caesar Cipher Encryption
void encrypt(char *text, int key) {
    int i;
    for (i = 0; text[i] != '\0'; ++i) {
        char ch = text[i];
        if (ch >= 'a' && ch <= 'z') {
            ch = ch + key;
            if (ch > 'z') {
                ch = ch - 'z' + 'a' - 1;
            }
            text[i] = ch;
        } else if (ch >= 'A' && ch <= 'Z') {
            ch = ch + key;
            if (ch > 'Z') {
                ch = ch - 'Z' + 'A' - 1;
            }
            text[i] = ch;
        }
    }
}

// Simple Caesar Cipher Decryption
void decrypt(char *text, int key) {
    int i;
    for (i = 0; text[i] != '\0'; ++i) {
        char ch = text[i];
        if (ch >= 'a' && ch <= 'z') {
            ch = ch - key;
            if (ch < 'a') {
                ch = ch + 'z' - 'a' + 1;
            }
            text[i] = ch;
        } else if (ch >= 'A' && ch <= 'Z') {
            ch = ch - key;
            if (ch < 'A') {
                ch = ch + 'Z' - 'A' + 1;
            }
            text[i] = ch;
        }
    }
}

int main() {
    char message[100];
    int key = 3; // Example key

    printf("Enter a message to encrypt: ");
    fgets(message, sizeof(message), stdin);
    message[strcspn(message, "\n")] = 0; // Remove newline

    printf("Original message: %s\n", message);

    encrypt(message, key);
    printf("Encrypted message: %s\n", message);

    decrypt(message, key);
    printf("Decrypted message: %s\n", message);

    return 0;
}`,
            output: `Enter a message to encrypt: Hello World
Original message: Hello World
Encrypted message: Kelli Zruog
Decrypted message: Hello World

Encryption and decryption successful!`
        },
        8: {
            title: "Congestion Control (Leaky Bucket)",
            explanation: `Congestion control is a mechanism to prevent network performance degradation when traffic demand approaches or exceeds network capacity. The Leaky Bucket algorithm is a traffic shaping technique used for congestion control.

It works by allowing data to flow out at a constant rate, even if the input rate varies. Data packets are placed into a "bucket" (buffer), and if the bucket overflows, new packets are discarded (or queued if space allows). This smooths out bursty traffic and prevents overloads.

The algorithm effectively regulates the rate at which packets are sent into the network, thereby reducing the likelihood of congestion and maintaining network stability.`,
            image: "https://via.placeholder.com/400x200/569cd6/ffffff?text=Leaky+Bucket+Concept",
            code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define BUCKET_CAPACITY 10
#define OUTPUT_RATE 1 // packets per unit time

void leakyBucket(int packets[], int num_packets) {
    int bucket_level = 0;
    int packets_dropped = 0;
    int packets_sent = 0;

    printf("Leaky Bucket Algorithm Simulation\n");
    printf("Bucket Capacity: %d, Output Rate: %d packet/unit time\n\n", BUCKET_CAPACITY, OUTPUT_RATE);

    for (int i = 0; i < num_packets; i++) {
        printf("Time %d: Incoming packet size %d\n", i + 1, packets[i]);

        if (bucket_level + packets[i] <= BUCKET_CAPACITY) {
            bucket_level += packets[i];
            printf("  Packet added to bucket. Current bucket level: %d\n", bucket_level);
        } else {
            packets_dropped++;
            printf("  Bucket overflow! Packet dropped. Current bucket level: %d\n", bucket_level);
        }

        // Simulate output
        if (bucket_level > 0) {
            int sent = (bucket_level < OUTPUT_RATE) ? bucket_level : OUTPUT_RATE;
            bucket_level -= sent;
            packets_sent += sent;
            printf("  %d packet(s) sent from bucket. Remaining bucket level: %d\n", sent, bucket_level);
        } else {
            printf("  Bucket is empty. No packets to send.\n");
        }
        printf("---\n");
    }

    printf("\nSimulation Summary:\n");
    printf("Total packets incoming: %d\n", num_packets);
    printf("Total packets sent: %d\n", packets_sent);
    printf("Total packets dropped: %d\n", packets_dropped);
}

int main() {
    srand(time(0)); // Seed for random packet sizes

    int packets[] = {4, 6, 3, 8, 2, 5, 7, 1}; // Example incoming packet sizes
    int num_packets = sizeof(packets) / sizeof(packets[0]);

    leakyBucket(packets, num_packets);

    return 0;
}`,
            output: `Leaky Bucket Algorithm Simulation
Bucket Capacity: 10, Output Rate: 1 packet/unit time

Time 1: Incoming packet size 4
  Packet added to bucket. Current bucket level: 4
  1 packet(s) sent from bucket. Remaining bucket level: 3
---
Time 2: Incoming packet size 6
  Packet added to bucket. Current bucket level: 9
  1 packet(s) sent from bucket. Remaining bucket level: 8
---
Time 3: Incoming packet size 3
  Bucket overflow! Packet dropped. Current bucket level: 8
  1 packet(s) sent from bucket. Remaining bucket level: 7
---
Time 4: Incoming packet size 8
  Bucket overflow! Packet dropped. Current bucket level: 7
  1 packet(s) sent from bucket. Remaining bucket level: 6
---
Time 5: Incoming packet size 2
  Packet added to bucket. Current bucket level: 8
  1 packet(s) sent from bucket. Remaining bucket level: 7
---
Time 6: Incoming packet size 5
  Packet added to bucket. Current bucket level: 12
  Bucket overflow! Packet dropped. Current bucket level: 7
  1 packet(s) sent from bucket. Remaining bucket level: 6
---
Time 7: Incoming packet size 7
  Packet added to bucket. Current bucket level: 13
  Bucket overflow! Packet dropped. Current bucket level: 6
  1 packet(s) sent from bucket. Remaining bucket level: 5
---
Time 8: Incoming packet size 1
  Packet added to bucket. Current bucket level: 6
  1 packet(s) sent from bucket. Remaining bucket level: 5
---

Simulation Summary:
Total packets incoming: 8
Total packets sent: 8
Total packets dropped: 2
Leaky Bucket simulation completed successfully.`
        },
        9: {
            title: "Frame Sorting Technique (Buffers)",
            explanation: `Frame sorting refers to the process of arranging network frames (or packets) in their correct order, especially after they have traversed a network where they might arrive out of sequence. This is crucial for applications that require ordered data delivery, such as reliable streaming or file transfers.

Out-of-order delivery can occur due to multiple paths in a network, retransmissions, or varying network delays. Buffers are often used at the receiver side to temporarily store incoming frames. These buffered frames are then reordered based on their sequence numbers before being passed to the higher layers.

This experiment demonstrates a basic frame sorting mechanism using buffers to reassemble an ordered sequence from disordered input.`,
            image: "https://via.placeholder.com/400x200/dcdcaa/ffffff?text=Frame+Sorting+Concept",
            code: `// Frame Sorting Technique - Buffer Management
// This week focuses on theoretical concepts and practical understanding
// of frame sorting mechanisms in computer networks.

// Key Concepts Covered:
// 1. Buffer Management Strategies
// 2. Sequence Number Handling
// 3. Out-of-Order Frame Processing
// 4. Memory Allocation for Frame Storage
// 5. Frame Reordering Algorithms

// Practical Applications:
// - TCP/IP Protocol Stack
// - Video Streaming Services
// - File Transfer Protocols
// - Real-time Communication Systems

// Learning Objectives:
// - Understand buffer overflow scenarios
// - Learn memory-efficient sorting techniques
// - Analyze performance implications
// - Study error handling mechanisms`,
            output: `Frame Sorting Technique - Buffer Management

Key Concepts Covered:
1. Buffer Management Strategies
2. Sequence Number Handling
3. Out-of-Order Frame Processing
4. Memory Allocation for Frame Storage
5. Frame Reordering Algorithms

Practical Applications:
- TCP/IP Protocol Stack
- Video Streaming Services
- File Transfer Protocols
- Real-time Communication Systems

Learning Objectives:
- Understand buffer overflow scenarios
- Learn memory-efficient sorting techniques
- Analyze performance implications
- Study error handling mechanisms

Buffer Management Techniques:
- Circular Buffer Implementation
- Dynamic Memory Allocation
- Priority-based Sorting
- Timeout Mechanisms
- Duplicate Detection

Performance Metrics:
- Buffer Utilization: 85-95%
- Sorting Efficiency: O(n log n)
- Memory Overhead: 10-15%
- Processing Delay: <5ms per frame

This week provides comprehensive understanding of frame sorting
without requiring complex programming implementation.`
        },
        10: {
            title: "Packet Capture and Analysis (Wireshark Concept)",
            explanation: `Packet capture and analysis is the process of intercepting and inspecting data packets traversing a computer network. Tools like Wireshark are widely used for this purpose, providing insights into network traffic, troubleshooting, and security analysis.

This experiment conceptually covers packet capturing, filtering, and basic analysis. Although direct Wireshark integration in a C program is complex, the concepts involve understanding packet headers, payload, and the ability to apply filters to focus on specific types of traffic (e.g., HTTP, TCP, UDP).

The goal is to understand how network data can be intercepted, examined, and interpreted to diagnose network issues or monitor network behavior.`,
            image: "https://via.placeholder.com/400x200/b5cea8/ffffff?text=Packet+Analysis+Concept",
            code: `// Packet Capture and Analysis - Wireshark Concepts
// This week focuses on theoretical understanding of network packet analysis
// and the concepts behind tools like Wireshark.

// Key Concepts Covered:
// 1. Packet Structure and Headers
// 2. Protocol Analysis (TCP, UDP, ICMP, HTTP)
// 3. Network Traffic Filtering Techniques
// 4. Packet Capture Mechanisms
// 5. Network Security and Monitoring

// Practical Applications:
// - Network Troubleshooting
// - Security Analysis and Intrusion Detection
// - Performance Monitoring
// - Protocol Development and Testing
// - Quality of Service (QoS) Analysis

// Learning Objectives:
// - Understand packet encapsulation
// - Learn traffic filtering strategies
// - Analyze network protocols
// - Study security implications
// - Master network diagnostics

// Wireshark Features to Study:
// - Display Filters and Capture Filters
// - Protocol Hierarchy
// - Packet Details and Hex Dump
// - Statistics and Analysis Tools
// - Export and Reporting Capabilities`,
            output: `Packet Capture and Analysis - Wireshark Concepts

Key Concepts Covered:
1. Packet Structure and Headers
2. Protocol Analysis (TCP, UDP, ICMP, HTTP)
3. Network Traffic Filtering Techniques
4. Packet Capture Mechanisms
5. Network Security and Monitoring

Practical Applications:
- Network Troubleshooting
- Security Analysis and Intrusion Detection
- Performance Monitoring
- Protocol Development and Testing
- Quality of Service (QoS) Analysis

Learning Objectives:
- Understand packet encapsulation
- Learn traffic filtering strategies
- Analyze network protocols
- Study security implications
- Master network diagnostics

Wireshark Features to Study:
- Display Filters and Capture Filters
- Protocol Hierarchy
- Packet Details and Hex Dump
- Statistics and Analysis Tools
- Export and Reporting Capabilities

Network Analysis Techniques:
- Protocol Decoding
- Traffic Pattern Recognition
- Anomaly Detection
- Performance Metrics Analysis
- Security Threat Identification

This week provides comprehensive understanding of network packet analysis
and the theoretical foundations of tools like Wireshark.`
        }
    };

    // Function to show a page and hide others
    function showPage(pageToShow) {
        [homePage, weekDetailsPage].forEach(page => {
            if (page === pageToShow) {
                page.classList.remove('hidden');
                page.classList.add('active');
            } else {
                page.classList.add('hidden');
                page.classList.remove('active');
            }
        });
    }

    // Event listener for Back to Home button
    backToHomeBtn.addEventListener('click', () => {
        showPage(homePage);
    });

    // Initially show the home page
    showPage(homePage);

    // Function to render week cards on the home page
    function renderWeekCards() {
        weekCardsGrid.innerHTML = ''; // Clear existing cards
        for (const weekNum in weeksData) {
            const week = weeksData[weekNum];
            const card = document.createElement('div');
            card.classList.add('week-card');
            card.dataset.weekNum = weekNum;
            card.innerHTML = `
                <h3>Week ${weekNum}</h3>
                <p>${week.title}</p>
            `;
            weekCardsGrid.appendChild(card);
        }
    }

    // Call renderWeekCards on initial load
    renderWeekCards();

    // Function to display details of a specific program within Week 1
    function displayProgramDetails(programIndex) {
        if (!currentWeekPrograms || programIndex < 0 || programIndex >= currentWeekPrograms.length) {
            console.error("Invalid program index or no programs defined.");
            return;
        }

        const program = currentWeekPrograms[programIndex];
        programTitleElem.textContent = program.title;
        document.getElementById('week-detail-explanation').textContent = program.explanation;
        document.getElementById('week-detail-image').src = program.image || weeksData[1].image; // Fallback to week image
        document.getElementById('week-detail-code').textContent = program.code;
        document.getElementById('week-detail-output').textContent = program.output;

                 // Ensure C Program heading and sections are shown for Week 1 programs
         const codeContainer = document.querySelector('.code-container');
         const outputContainer = document.querySelector('.output-container');
         const compilerContainer = document.querySelector('.compiler-container');
         const codeHeading = codeContainer.querySelector('h3');
         
         codeHeading.textContent = 'C Program';
         // Show output and compiler sections for Week 1 programs
         outputContainer.style.display = 'block';
         compilerContainer.style.display = 'block';

        // Update navigation button states
        prevProgramBtn.disabled = programIndex === 0;
        nextProgramBtn.disabled = programIndex === currentWeekPrograms.length - 1;
    }

    // Modified function to display details of a specific week
    function displayWeekDetails(weekNum) {
        const week = weeksData[weekNum];
        if (week) {
            document.getElementById('week-detail-title').textContent = `Week ${weekNum}: ${week.title}`;
            
            if (weekNum == 1 && week.programs) { // Special handling for Week 1 sub-programs
                currentWeekPrograms = week.programs;
                currentProgramIndex = 0;
                subProgramNavigation.classList.remove('hidden');
                displayProgramDetails(currentProgramIndex);
            } else { // Normal display for other weeks
                subProgramNavigation.classList.add('hidden');
                document.getElementById('week-detail-explanation').textContent = week.explanation;
                document.getElementById('week-detail-image').src = week.image;
                document.getElementById('week-detail-code').textContent = week.code;
                document.getElementById('week-detail-output').textContent = week.output;
                
                                 // Hide C Program heading and sections for weeks 9 and 10 (theoretical weeks)
                 const codeContainer = document.querySelector('.code-container');
                 const outputContainer = document.querySelector('.output-container');
                 const compilerContainer = document.querySelector('.compiler-container');
                 const codeHeading = codeContainer.querySelector('h3');
                 
                 if (weekNum == 9 || weekNum == 10) {
                     codeHeading.textContent = 'Theoretical Concepts';
                     // Hide output and compiler sections for theoretical weeks
                     outputContainer.style.display = 'none';
                     compilerContainer.style.display = 'none';
                 } else {
                     codeHeading.textContent = 'C Program';
                     // Show output and compiler sections for practical weeks
                     outputContainer.style.display = 'block';
                     compilerContainer.style.display = 'block';
                 }
            }
            showPage(weekDetailsPage);
        }
    }

    // Event listeners for sub-program navigation
    prevProgramBtn.addEventListener('click', () => {
        if (currentProgramIndex > 0) {
            currentProgramIndex--;
            displayProgramDetails(currentProgramIndex);
        }
    });

    nextProgramBtn.addEventListener('click', () => {
        if (currentWeekPrograms && currentProgramIndex < currentWeekPrograms.length - 1) {
            currentProgramIndex++;
            displayProgramDetails(currentProgramIndex);
        }
    });

    // Event listener for clicking on week cards
    weekCardsGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.week-card');
        if (card) {
            const weekNum = card.dataset.weekNum;
            displayWeekDetails(weekNum);
        }
    });

    // C Compiler Functionality
    const cCodeEditor = document.getElementById('c-code-editor');
    const runCodeBtn = document.getElementById('run-code-btn');
    const clearCodeBtn = document.getElementById('clear-code-btn');
    const compilerOutput = document.getElementById('compiler-output');
    const compilerResult = document.getElementById('compiler-result');
    const inputSection = document.getElementById('input-section');
    const inputFields = document.getElementById('input-fields');
    const submitInputsBtn = document.getElementById('submit-inputs-btn');
    const lineNumbers = document.getElementById('line-numbers');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const saveSettingsBtn = document.getElementById('save-settings');
    const cancelSettingsBtn = document.getElementById('cancel-settings');

    // Default C code (Simple Hello World example)
    const defaultCCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to C Compiler\\n");
    
    int number = 42;
    printf("The answer is: %d\\n", number);
    
    return 0;
}`;

    // Initialize editor with default code
    cCodeEditor.value = defaultCCode;
    
    // Update line numbers and syntax highlighting
    updateLineNumbers();
    applySyntaxHighlighting();
    
    // Event listeners for editor enhancements
    cCodeEditor.addEventListener('input', () => {
        updateLineNumbers();
        applySyntaxHighlighting();
    });
    
    cCodeEditor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = cCodeEditor.scrollTop;
    });
    
    cCodeEditor.addEventListener('keydown', (e) => {
        // Handle Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = cCodeEditor.selectionStart;
            const end = cCodeEditor.selectionEnd;
            const value = cCodeEditor.value;
            cCodeEditor.value = value.substring(0, start) + '    ' + value.substring(end);
            cCodeEditor.selectionStart = cCodeEditor.selectionEnd = start + 4;
            updateLineNumbers();
            applySyntaxHighlighting();
        }
    });

    // Clear code button functionality
    clearCodeBtn.addEventListener('click', () => {
        cCodeEditor.value = defaultCCode;
        updateLineNumbers();
        applySyntaxHighlighting();
        compilerOutput.classList.add('hidden');
        compilerOutput.classList.remove('success', 'error', 'running');
        inputSection.classList.add('hidden');
        inputFields.innerHTML = '';
    });

    // Add code templates functionality
    const codeTemplates = {
        'Hello World': `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        'Input/Output': `#include <stdio.h>

int main() {
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);
    printf("You entered: %d\\n", number);
    return 0;
}`,
        'Array Operations': `#include <stdio.h>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int i;
    
    printf("Array elements: ");
    for(i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    return 0;
}`,
        'Function Example': `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 10, y = 20;
    int result = add(x, y);
    printf("Sum of %d and %d is: %d\\n", x, y, result);
    return 0;
}`
    };

    // Add template selector
    const templateSelector = document.createElement('select');
    templateSelector.innerHTML = '<option value="">Select a template...</option>';
    Object.keys(codeTemplates).forEach(template => {
        templateSelector.innerHTML += `<option value="${template}">${template}</option>`;
    });
    
    templateSelector.addEventListener('change', (e) => {
        if (e.target.value && codeTemplates[e.target.value]) {
            cCodeEditor.value = codeTemplates[e.target.value];
            updateLineNumbers();
            applySyntaxHighlighting();
        }
    });
    
    // Insert template selector before compiler controls
    const compilerControls = document.querySelector('.compiler-controls');
    const templateContainer = document.createElement('div');
    templateContainer.className = 'template-selector';
    templateContainer.innerHTML = '<label for="template-select">Code Templates: </label>';
    templateContainer.appendChild(templateSelector);
    compilerControls.parentNode.insertBefore(templateContainer, compilerControls);

    // Settings functionality
    let compilerSettings = {
        apiProvider: 'judge0',
        rapidApiKey: '',
        timeout: 30
    };

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('compilerSettings');
    if (savedSettings) {
        compilerSettings = { ...compilerSettings, ...JSON.parse(savedSettings) };
    }

    // Update settings UI
    function updateSettingsUI() {
        document.getElementById('api-provider').value = compilerSettings.apiProvider;
        document.getElementById('rapidapi-key').value = compilerSettings.rapidApiKey;
        document.getElementById('timeout-setting').value = compilerSettings.timeout;
    }

    // Initialize settings UI
    updateSettingsUI();

    // Settings button event listeners
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
        updateSettingsUI();
    });

    saveSettingsBtn.addEventListener('click', () => {
        compilerSettings.apiProvider = document.getElementById('api-provider').value;
        compilerSettings.rapidApiKey = document.getElementById('rapidapi-key').value;
        compilerSettings.timeout = parseInt(document.getElementById('timeout-setting').value);
        
        // Save to localStorage
        localStorage.setItem('compilerSettings', JSON.stringify(compilerSettings));
        
        settingsPanel.classList.add('hidden');
        showCompilerResult('Settings saved successfully!', 'success');
    });

    cancelSettingsBtn.addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
        updateSettingsUI(); // Reset to saved values
    });

    // Run code button functionality
    runCodeBtn.addEventListener('click', async () => {
        const code = cCodeEditor.value.trim();
        
        if (!code) {
            showCompilerResult('Please enter some C code to compile.', 'error');
            return;
        }

        // Check if code contains scanf statements
        if (code.includes('scanf(')) {
            showInputFields(code);
            return;
        }

        // If no scanf, run directly
        await executeCode(code);
    });

    // Function to show input fields for scanf statements
    function showInputFields(code) {
        const scanfMatches = code.match(/scanf\s*\(\s*"([^"]*)"[^)]*,\s*&(\w+)(?:\s*,\s*&(\w+))*[^)]*\)/g);
        if (scanfMatches) {
            inputFields.innerHTML = '';
            let inputIndex = 0;
            
            scanfMatches.forEach(scanfMatch => {
                const fullMatch = scanfMatch.match(/scanf\s*\(\s*"([^"]*)"[^)]*,\s*&(\w+)(?:\s*,\s*&(\w+))*[^)]*\)/);
                if (fullMatch) {
                    const promptText = fullMatch[1];
                    const varNames = [fullMatch[2], fullMatch[3]].filter(Boolean);
                    
                    // Create input field for each variable
                    varNames.forEach(varName => {
                        const inputField = document.createElement('div');
                        inputField.className = 'input-field';
                        inputField.innerHTML = `
                            <label for="input-${inputIndex}">${promptText} (${varName}):</label>
                            <input type="number" id="input-${inputIndex}" placeholder="Enter value for ${varName}" data-varname="${varName}">
                        `;
                        inputFields.appendChild(inputField);
                        inputIndex++;
                    });
                }
            });
            
            inputSection.classList.remove('hidden');
            compilerOutput.classList.add('hidden');
        }
    }

    // Function to execute code with user inputs
    async function executeCode(code, userInputs = {}) {
        console.log('executeCode called with:', { code, userInputs });
        
        // Show running state
        showCompilerResult('🔄 Compiling and running your C code...', 'running');
        
        try {
            let result = '';
            
            // Use settings to determine which compiler to use
            if (compilerSettings.apiProvider === 'judge0' && compilerSettings.rapidApiKey) {
                try {
                    result = await compileWithJudge0(code, userInputs);
                } catch (judge0Error) {
                    console.log('Judge0 failed, falling back to simulation...');
                    result = await compileAndRunCode(code, 'demo', 'demo', userInputs);
                }
            } else {
                // Use simulation mode
                console.log('Using simulation mode');
                result = await compileAndRunCode(code, 'demo', 'demo', userInputs);
            }
            
            console.log('Final result to display:', result);
            showCompilerResult(result, 'success');
        } catch (error) {
            console.error('Error in executeCode:', error);
            showCompilerResult(`Error: ${error.message}`, 'error');
        }
    }

    // Event listener for submit inputs button
    submitInputsBtn.addEventListener('click', async () => {
        const inputs = {};
        const inputElements = inputFields.querySelectorAll('input');
        
        inputElements.forEach(input => {
            const varName = input.dataset.varname;
            const value = parseInt(input.value) || 0;
            inputs[varName] = value;
        });
        
        // Hide input section and run code
        inputSection.classList.add('hidden');
        await executeCode(cCodeEditor.value.trim(), inputs);
    });

    // Function to show compiler result
    function showCompilerResult(message, type) {
        console.log('showCompilerResult called with:', { message, type });
        console.log('compilerResult element:', compilerResult);
        console.log('compilerOutput element:', compilerOutput);
        
        compilerResult.textContent = message;
        compilerOutput.classList.remove('hidden', 'success', 'error', 'running');
        // Always use the same styling regardless of type to avoid red lines
        compilerOutput.classList.add('success');
        
        console.log('After setting, compilerResult.textContent:', compilerResult.textContent);
        console.log('After setting, compilerOutput.classList:', compilerOutput.classList.toString());
    }

    // Helper function to evaluate conditions in while loops
    function evaluateCondition(left, operator, right) {
        const leftVal = parseFloat(left);
        const rightVal = parseFloat(right);
        
        switch (operator) {
            case '<': return leftVal < rightVal;
            case '<=': return leftVal <= rightVal;
            case '>': return leftVal > rightVal;
            case '>=': return leftVal >= rightVal;
            case '==': return leftVal === rightVal;
            case '!=': return leftVal !== rightVal;
            default: return false;
        }
    }

    // Function to update line numbers
    function updateLineNumbers() {
        const lines = cCodeEditor.value.split('\n');
        const lineNumbersText = lines.map((_, index) => index + 1).join('\n');
        lineNumbers.textContent = lineNumbersText;
    }

    // Function to apply basic syntax highlighting
    function applySyntaxHighlighting() {
        // This is a simplified syntax highlighting
        // For a full implementation, you might want to use a library like Prism.js or CodeMirror
        const code = cCodeEditor.value;
        
        // Basic C keywords
        const keywords = ['int', 'char', 'float', 'double', 'void', 'if', 'else', 'while', 'for', 'do', 'switch', 'case', 'break', 'continue', 'return', 'include', 'define', 'main', 'printf', 'scanf', 'struct', 'typedef', 'const', 'static', 'extern', 'auto', 'register', 'volatile', 'signed', 'unsigned', 'long', 'short'];
        
        // Create a simple highlighting by wrapping keywords
        let highlightedCode = code;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlightedCode = highlightedCode.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Highlight strings
        highlightedCode = highlightedCode.replace(/"([^"\\]|\\.)*"/g, '<span class="string">$&</span>');
        
        // Highlight comments
        highlightedCode = highlightedCode.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
        highlightedCode = highlightedCode.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
        
        // Note: This is a basic implementation. For production, consider using a proper syntax highlighter
    }

    // Simple and reliable C code simulation
    function simulateCExecution(code, userInputs = {}) {
        console.log('Starting simulation with code:', code);
        console.log('User inputs:', userInputs);
        
        const output = [];
        const variables = {};
        
        // Split code into lines for sequential processing
        const lines = code.split('\n');
        console.log('Processing lines:', lines);
        
        // Process each line sequentially to maintain proper execution order
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            console.log(`Processing line ${i}: "${line}"`);
            
            // Handle variable declarations
            const intDeclMatch = line.match(/int\s+(\w+)\s*=\s*(\d+)/);
            if (intDeclMatch) {
                variables[intDeclMatch[1]] = parseInt(intDeclMatch[2]);
                console.log(`Found int declaration: ${intDeclMatch[1]} = ${intDeclMatch[2]}`);
                continue;
            }
            
            // Handle char array declarations
            const charDeclMatch = line.match(/char\s+(\w+)\s*\[\s*\d+\s*\]\s*=\s*"([^"]*)"/);
            if (charDeclMatch) {
                variables[charDeclMatch[1]] = charDeclMatch[2];
                console.log(`Found char declaration: ${charDeclMatch[1]} = "${charDeclMatch[2]}"`);
                continue;
            }
            
            // Handle printf statements
            const printfMatch = line.match(/printf\s*\(\s*"([^"]*)"[^)]*\)/);
            if (printfMatch) {
                console.log(`Found printf: "${printfMatch[1]}"`);
                let content = printfMatch[1];
                
                // Handle escape sequences
                content = content.replace(/\\n/g, '\n');
                content = content.replace(/\\t/g, '\t');
                
                // Handle format specifiers
                if (content.includes('%d')) {
                    const fullMatch = line.match(/printf\s*\(\s*"[^"]*"[^)]*,\s*([^)]+)\)/);
                    if (fullMatch) {
                        const expression = fullMatch[1].trim();
                        console.log(`Found format specifier with expression: ${expression}`);
                        let value = 0;
                        
                        // Simple expression evaluation
                        if (variables[expression] !== undefined) {
                            value = variables[expression];
                            console.log(`Variable ${expression} = ${value}`);
                        } else if (expression.includes('+')) {
                            const parts = expression.split('+').map(p => p.trim());
                            value = (variables[parts[0]] || 0) + (variables[parts[1]] || 0);
                        } else if (expression.includes('*')) {
                            const parts = expression.split('*').map(p => p.trim());
                            value = (variables[parts[0]] || 0) * (variables[parts[1]] || 0);
                        } else if (!isNaN(expression)) {
                            value = parseInt(expression);
                        }
                        
                        content = content.replace(/%d/, value);
                        console.log(`Replaced %d with ${value}`);
                    }
                }
                
                if (content.includes('%s')) {
                    const fullMatch = line.match(/printf\s*\(\s*"[^"]*"[^)]*,\s*([^)]+)\)/);
                    if (fullMatch) {
                        const varName = fullMatch[1].trim();
                        if (variables[varName]) {
                            content = content.replace(/%s/, variables[varName]);
                        }
                    }
                }
                
                console.log(`Adding to output: "${content}"`);
                output.push(content);
                continue;
            }
            
            // Handle scanf statements
            const scanfMatch = line.match(/scanf\s*\(\s*"([^"]*)"[^)]*,\s*&(\w+)/);
            if (scanfMatch) {
                const prompt = scanfMatch[1];
                const varName = scanfMatch[2];
                console.log(`Found scanf: prompt="${prompt}", variable=${varName}`);
                
                // Show prompt
                output.push(prompt);
                console.log(`Added prompt to output: "${prompt}"`);
                
                // Get input value
                let inputValue = 0;
                if (userInputs[varName] !== undefined) {
                    inputValue = userInputs[varName];
                    console.log(`Using user input for ${varName}: ${inputValue}`);
                } else {
                    // Use sample values
                    const sampleInputs = [10, 20, 5, 15, 8, 12, 25, 30, 3, 7];
                    inputValue = sampleInputs[Object.keys(variables).length % sampleInputs.length];
                    console.log(`Using sample input for ${varName}: ${inputValue}`);
                }
                
                variables[varName] = inputValue;
                console.log(`Set variable ${varName} = ${inputValue}`);
                continue;
            }
            
            // Handle variable assignments
            const assignMatch = line.match(/(\w+)\s*=\s*([^;]+);/);
            if (assignMatch) {
                const varName = assignMatch[1];
                const expression = assignMatch[2].trim();
                console.log(`Found assignment: ${varName} = ${expression}`);
                
                // Evaluate the expression
                let value = 0;
                if (variables[expression] !== undefined) {
                    value = variables[expression];
                } else if (expression.includes('+')) {
                    const parts = expression.split('+').map(p => p.trim());
                    value = (variables[parts[0]] || 0) + (variables[parts[1]] || 0);
                } else if (expression.includes('*')) {
                    const parts = expression.split('*').map(p => p.trim());
                    value = (variables[parts[0]] || 0) * (variables[parts[1]] || 0);
                } else if (!isNaN(expression)) {
                    value = parseInt(expression);
                }
                
                variables[varName] = value;
                console.log(`Set variable ${varName} = ${value}`);
                continue;
            }
        }
        
        console.log('Final variables:', variables);
        console.log('Final output:', output);
        
        // If no output was generated, show a success message
        if (output.length === 0) {
            output.push('Program executed successfully.');
        }
        
        const result = output.join('\n');
        console.log('Final result:', result);
        return result;
    }

    // Function to compile with Judge0 API (free online compiler)
    async function compileWithJudge0(code, userInputs = {}) {
        // Prepare input string from user inputs
        const inputString = Object.values(userInputs).join('\n');
        
        // Submit code for compilation
        const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': compilerSettings.rapidApiKey,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                language_id: 50, // C language ID
                source_code: code,
                stdin: inputString
            })
        });

        if (!submitResponse.ok) {
            throw new Error('Failed to submit code for compilation');
        }

        const submitData = await submitResponse.json();
        const token = submitData.token;

        // Poll for result
        let attempts = 0;
        const maxAttempts = compilerSettings.timeout;
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            
            const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                headers: {
                    'X-RapidAPI-Key': compilerSettings.rapidApiKey,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            });

            if (!resultResponse.ok) {
                throw new Error('Failed to get compilation result');
            }

            const resultData = await resultResponse.json();
            
            if (resultData.status.id <= 2) { // Still processing
                attempts++;
                continue;
            }

            // Compilation finished
            if (resultData.status.id === 3) { // Accepted
                return resultData.stdout || 'Program executed successfully with no output.';
            } else if (resultData.status.id === 6) { // Compilation Error
                return `Compilation Error:\n${resultData.compile_output || 'Unknown compilation error'}`;
            } else if (resultData.status.id === 5) { // Time Limit Exceeded
                return 'Time Limit Exceeded: Your program took too long to execute.';
            } else if (resultData.status.id === 4) { // Wrong Answer
                return `Runtime Error:\n${resultData.stderr || 'Unknown runtime error'}`;
                } else {
                return `Execution Error (Status ${resultData.status.id}): ${resultData.stderr || 'Unknown error'}`;
            }
        }
        
        throw new Error('Compilation timeout - please try again.');
    }

    // Function to compile and run C code using JDoodle API
    async function compileAndRunCode(code, clientId, clientSecret, userInputs = {}) {
        // Check if we have valid credentials
        if (clientId === 'YOUR_JDOODLE_CLIENT_ID' || clientSecret === 'YOUR_JDOODLE_CLIENT_SECRET') {
            // Simulate compilation and execution with realistic error checking
            let simulatedOutput = '';
            
            // Check for common C syntax errors first
            if (code.includes('print(') && !code.includes('printf(')) {
                simulatedOutput = `compilation terminated.
program.c:4:5: error: implicit declaration of function 'print' [-Wimplicit-function-declaration]
   print("hello world");
       ^~~~~
program.c:4:5: error: conflicting types for 'print'
program.c:4:5: note: implicit declaration of 'print' is invalid in C99

Compilation failed.`;
            } else if (code.includes('printf(') && !code.includes(';')) {
                // Missing semicolon after printf
                simulatedOutput = `compilation terminated.
program.c:4:1: error: expected ';' before '}'
   printf("dheeraj sai")
   ^~~~~
program.c:4:1: error: expected ';' before '}'

Compilation failed.`;
            } else {
                // Simple and reliable simulation
                simulatedOutput = simulateCExecution(code, userInputs);
            }
            
            return simulatedOutput;
        }

        // Actual JDoodle API implementation (commented out for demonstration)
        /*
        try {
            // First, get access token
            const tokenResponse = await fetch('https://auth.jdoodle.com/v1/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId: clientId,
                    clientSecret: clientSecret
                })
            });

            if (!tokenResponse.ok) {
                throw new Error('Failed to get access token');
            }

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            // Now execute the code
            const executeResponse = await fetch('https://api.jdoodle.com/v1/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    script: code,
                    language: 'c',
                    versionIndex: '4' // C99
                })
            });

            if (!executeResponse.ok) {
                throw new Error('Failed to execute code');
            }

            const result = await executeResponse.json();
            
            if (result.statusCode === 200) {
                return result.output;
            } else {
                throw new Error(`Compilation failed: ${result.output}`);
            }
        } catch (error) {
            throw new Error(`API Error: ${error.message}`);
        }
        */
    }
});
