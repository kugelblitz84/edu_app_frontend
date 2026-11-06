import { Exam, UpcomingExamItem, ExamHistoryItem } from '../types';

export const UPCOMING_EXAMS: UpcomingExamItem[] = [
  {
    id: 'exam-1',
    title: '2026 Fall CSE Web Development Finals',
    timeRemaining: '12hrs 10mins',
    visibility: 'Private',
    category: 'Computer Science',
    startsAt: '2026-11-07T10:00:00Z',
    closesAt: '2026-11-07T12:00:00Z',
    durationMinutes: 45,
    totalMarks: 50,
    questionCount: 5
  },
  {
    id: 'exam-2',
    title: '2026 Fall Competitive Programming Regional',
    timeRemaining: '18hrs 30mins',
    visibility: 'Public',
    category: 'Algorithms',
    startsAt: '2026-11-07T16:00:00Z',
    closesAt: '2026-11-07T19:00:00Z',
    durationMinutes: 60,
    totalMarks: 60,
    questionCount: 6
  },
  {
    id: 'exam-3',
    title: '2026 Fall Graphic Design & UI Finals',
    timeRemaining: '1d 04hrs',
    visibility: 'Private',
    category: 'Design Systems',
    startsAt: '2026-11-08T09:00:00Z',
    closesAt: '2026-11-08T11:00:00Z',
    durationMinutes: 30,
    totalMarks: 40,
    questionCount: 4
  },
  {
    id: 'exam-4',
    title: 'Certified Cloud Architect Practice Test',
    timeRemaining: 'Available Now',
    visibility: 'Public',
    category: 'Cloud Engineering',
    startsAt: '2026-11-01T00:00:00Z',
    closesAt: '2026-12-31T23:59:59Z',
    durationMinutes: 30,
    totalMarks: 50,
    questionCount: 5
  },
  {
    id: 'exam-5',
    title: 'PostgreSQL Internals & Query Tuning Mock',
    timeRemaining: 'Available Now',
    visibility: 'Public',
    category: 'Databases',
    startsAt: '2026-11-01T00:00:00Z',
    closesAt: '2026-12-31T23:59:59Z',
    durationMinutes: 25,
    totalMarks: 40,
    questionCount: 4
  }
];

export const FULL_EXAMS: Record<string, Exam> = {
  'exam-1': {
    id: 'exam-1',
    title: '2026 Fall CSE Web Development Finals',
    description: 'Proctored semester assessment covering HTTP/3, Next.js Server Components, React 19 concurrent features, and database transactions.',
    category: 'Computer Science',
    durationMinutes: 45,
    passPercentage: 60,
    totalMarks: 50,
    visibility: 'Private',
    startsAt: '2026-11-07T10:00:00Z',
    closesAt: '2026-11-07T12:00:00Z',
    institutionName: 'Void Pavilion Institute',
    isProctored: true,
    instructions: [
      'This exam is proctored. Switching tabs or leaving full-screen may be logged.',
      'Answers are autosaved continuously in real time via live WebSocket sync.',
      'You can flag questions to review before final submission.',
      'Passing score is 60% (30 out of 50 marks).'
    ],
    questions: [
      {
        id: 'q1',
        text: 'In React 19 Server Components, what is the primary architectural benefit of streaming SSR compared to traditional client hydration?',
        marks: 10,
        options: [
          { id: 'opt1', text: 'It completely eliminates the requirement for any JavaScript on client browsers.' },
          { id: 'opt2', text: 'It renders fast HTML chunks immediately and progressively streams slower asynchronous data boundaries.' },
          { id: 'opt3', text: 'It forces all state to be saved inside Redux storage before rendering.' },
          { id: 'opt4', text: 'It compiles React code into WebAssembly ahead of time.' }
        ],
        correctOptionIds: ['opt2'],
        explanation: 'Streaming SSR allows HTML shells to be sent instantly while asynchronous Suspense boundaries stream in when ready, reducing Time to First Meaningful Paint.'
      },
      {
        id: 'q2',
        text: 'Why does optimistic locking using a numeric `version` column prevent lost update anomalies in concurrent web applications?',
        marks: 10,
        options: [
          { id: 'opt1', text: 'It holds exclusive database write locks on the entire table until the HTTP request completes.' },
          { id: 'opt2', text: 'It uses pessimistic row locking at the TCP network layer.' },
          { id: 'opt3', text: 'It updates the record only if the current version matches the expected version, failing if another process modified it first.' },
          { id: 'opt4', text: 'It automatically merges conflicting JSON fields using vector clocks without user intervention.' }
        ],
        correctOptionIds: ['opt3'],
        explanation: 'Optimistic locking checks `WHERE id = :id AND version = :version`. If an intervening write incremented the version, 0 rows are updated, signaling a conflict.'
      },
      {
        id: 'q3',
        text: 'When offloading high-bandwidth video/file uploads in modern cloud architectures, which pattern prevents the API server from becoming a network bottleneck?',
        marks: 10,
        options: [
          { id: 'opt1', text: 'Streaming the binary directly through the Node.js API server memory buffers.' },
          { id: 'opt2', text: 'Generating pre-signed direct-to-storage URLs (S3/GCS/MinIO) and having the client PUT directly to the bucket.' },
          { id: 'opt3', text: 'Converting files to Base64 strings inside PostgreSQL JSONB columns.' },
          { id: 'opt4', text: 'Storing binary blobs in the local Docker container filesystem.' }
        ],
        correctOptionIds: ['opt2'],
        explanation: 'Pre-signed direct upload bypasses the application server completely for large binaries, freeing web servers from handling heavy I/O workloads.'
      },
      {
        id: 'q4',
        text: 'Which HTTP status code is sent to trigger the automatic refresh token flow when an Access Token expires?',
        marks: 10,
        options: [
          { id: 'opt1', text: '400 Bad Request' },
          { id: 'opt2', text: '401 Unauthorized' },
          { id: 'opt3', text: '403 Forbidden' },
          { id: 'opt4', text: '404 Not Found' }
        ],
        correctOptionIds: ['opt2'],
        explanation: 'A 401 Unauthorized signals an expired or invalid access token, prompting the HTTP client interceptor to issue a token refresh request.'
      },
      {
        id: 'q5',
        text: 'What is the purpose of using Next.js Route Groups like `(public)` or `(app)` in directory architecture?',
        marks: 10,
        options: [
          { id: 'opt1', text: 'They add required URL path segments to all nested routes.' },
          { id: 'opt2', text: 'They organize routes and create scoped layouts without altering the browser URL path structure.' },
          { id: 'opt3', text: 'They restrict page execution solely to Node.js edge lambdas.' },
          { id: 'opt4', text: 'They automatically encrypt all HTTP responses.' }
        ],
        correctOptionIds: ['opt2'],
        explanation: 'Parentheses in folder names denote route groups in Next.js App Router, enabling layout sharing and logical isolation without affecting the URL route.'
      }
    ]
  },
  'exam-2': {
    id: 'exam-2',
    title: '2026 Fall Competitive Programming Regional',
    description: 'Advanced graph algorithms, minimum spanning trees, segment trees with lazy propagation, and combinatorial dynamic programming.',
    category: 'Algorithms',
    durationMinutes: 60,
    passPercentage: 70,
    totalMarks: 60,
    visibility: 'Public',
    startsAt: '2026-11-07T16:00:00Z',
    closesAt: '2026-11-07T19:00:00Z',
    institutionName: 'IST University',
    isProctored: false,
    instructions: [
      'Calculators and standard reference materials are allowed.',
      'Submit answers before the 60-minute time limit expires.'
    ],
    questions: [
      {
        id: 'cp1',
        text: 'What is the worst-case time complexity of Dijkstra’s algorithm using a binary min-heap for a graph with V vertices and E edges?',
        marks: 10,
        options: [
          { id: 'cp1_1', text: 'O(V^2)' },
          { id: 'cp1_2', text: 'O((V + E) log V)' },
          { id: 'cp1_3', text: 'O(V * E)' },
          { id: 'cp1_4', text: 'O(E log E + V^2)' }
        ],
        correctOptionIds: ['cp1_2'],
        explanation: 'With a standard binary min-heap, each vertex extraction takes O(log V) and each edge relaxation takes O(log V), yielding O((V + E) log V).'
      },
      {
        id: 'cp2',
        text: 'Which algorithm is best suited for finding all-pairs shortest paths in a dense directed graph without negative cycles?',
        marks: 10,
        options: [
          { id: 'cp2_1', text: 'Bellman-Ford Algorithm' },
          { id: 'cp2_2', text: 'Floyd-Warshall Algorithm' },
          { id: 'cp2_3', text: 'Breadth-First Search' },
          { id: 'cp2_4', text: 'Kruskal Algorithm' }
        ],
        correctOptionIds: ['cp2_2'],
        explanation: 'Floyd-Warshall runs in O(V^3) time and operates directly on adjacency matrices, making it ideal for all-pairs shortest paths in dense graphs.'
      },
      {
        id: 'cp3',
        text: 'What technique allows a Segment Tree to perform range updates in O(log N) rather than O(N)?',
        marks: 10,
        options: [
          { id: 'cp3_1', text: 'Persistent path copying' },
          { id: 'cp3_2', text: 'Lazy propagation' },
          { id: 'cp3_3', text: 'Square root decomposition' },
          { id: 'cp3_4', text: 'Fenwick tree compression' }
        ],
        correctOptionIds: ['cp3_2'],
        explanation: 'Lazy propagation defers updates to child nodes until those nodes are explicitly queried, maintaining O(log N) range updates.'
      },
      {
        id: 'cp4',
        text: 'What is the number of edges in a tree with N vertices?',
        marks: 10,
        options: [
          { id: 'cp4_1', text: 'N' },
          { id: 'cp4_2', text: 'N - 1' },
          { id: 'cp4_3', text: 'N + 1' },
          { id: 'cp4_4', text: '2N' }
        ],
        correctOptionIds: ['cp4_2'],
        explanation: 'By definition, a connected acyclic graph (tree) with N vertices always contains exactly N - 1 edges.'
      },
      {
        id: 'cp5',
        text: 'In 0/1 Knapsack problem with weights W and values V, what is the time complexity of the dynamic programming approach?',
        marks: 10,
        options: [
          { id: 'cp5_1', text: 'O(N * W)' },
          { id: 'cp5_2', text: 'O(2^N)' },
          { id: 'cp5_3', text: 'O(N log N)' },
          { id: 'cp5_4', text: 'O(W^2)' }
        ],
        correctOptionIds: ['cp5_1'],
        explanation: 'The pseudo-polynomial DP solution builds an N x W table where each cell takes constant time, yielding O(N * W).'
      },
      {
        id: 'cp6',
        text: 'Which data structure supports disjoint set union operations in near-constant amortized time with path compression and union by rank?',
        marks: 10,
        options: [
          { id: 'cp6_1', text: 'Disjoint Set Union (DSU / Union-Find)' },
          { id: 'cp6_2', text: 'B-Tree' },
          { id: 'cp6_3', text: 'Skip List' },
          { id: 'cp6_4', text: 'Trie' }
        ],
        correctOptionIds: ['cp6_1'],
        explanation: 'DSU with union by rank and path compression achieves O(alpha(N)) per operation, where alpha is the inverse Ackermann function.'
      }
    ]
  },
  'exam-4': {
    id: 'exam-4',
    title: 'Certified Cloud Architect Practice Test',
    description: 'Comprehensive practice gym test for cloud reliability, multi-region failover, load balancing, and object storage.',
    category: 'Cloud Engineering',
    durationMinutes: 30,
    passPercentage: 70,
    totalMarks: 50,
    visibility: 'Public',
    startsAt: '2026-11-01T00:00:00Z',
    closesAt: '2026-12-31T23:59:59Z',
    institutionName: 'Cloud Academy Global',
    isProctored: false,
    instructions: [
      'Self-paced practice simulation.',
      'Instant answers and explanations available upon completion.'
    ],
    questions: [
      {
        id: 'c1',
        text: 'Which cloud architecture pattern ensures zero-downtime database failovers across multiple availability zones?',
        marks: 10,
        options: [
          { id: 'c1_1', text: 'Synchronous replication with automated DNS failover and health checks' },
          { id: 'c1_2', text: 'Weekly cron backups stored on external USB drives' },
          { id: 'c1_3', text: 'Manual server restarts via SSH' },
          { id: 'c1_4', text: 'Disabling transaction logs' }
        ],
        correctOptionIds: ['c1_1'],
        explanation: 'Synchronous replication ensures replica consistency, while automated health checks and DNS rerouting achieve seamless zero-downtime failover.'
      },
      {
        id: 'c2',
        text: 'What is the primary benefit of Content Delivery Networks (CDNs) for media assets?',
        marks: 10,
        options: [
          { id: 'c2_1', text: 'Serving cached assets from edge locations nearest to the end user to minimize latency' },
          { id: 'c2_2', text: 'Re-encoding videos in real time on mobile phones' },
          { id: 'c2_3', text: 'Bypassing browser CORS protections' },
          { id: 'c2_4', text: 'Running full relational database transactions at the client edge' }
        ],
        correctOptionIds: ['c2_1'],
        explanation: 'CDNs cache static and media assets in geographically distributed Points of Presence (PoPs), slashing latency.'
      },
      {
        id: 'c3',
        text: 'Which consistency model is typically provided by modern object storage systems like S3?',
        marks: 10,
        options: [
          { id: 'c3_1', text: 'Strong read-after-write consistency for PUTs and DELETEs' },
          { id: 'c3_2', text: 'Eventual consistency taking up to 24 hours' },
          { id: 'c3_3', text: 'Strict two-phase commit over TCP' },
          { id: 'c3_4', text: 'No consistency guarantees' }
        ],
        correctOptionIds: ['c3_1'],
        explanation: 'AWS S3 and modern cloud storage deliver strong read-after-write consistency for all PUT and DELETE operations of objects.'
      },
      {
        id: 'c4',
        text: 'What does the Circuit Breaker design pattern prevent in distributed microservices?',
        marks: 10,
        options: [
          { id: 'c4_1', text: 'Cascading failures when a downstream dependency is degraded or unreachable' },
          { id: 'c4_2', text: 'SQL injection attacks' },
          { id: 'c4_3', text: 'Hardware electrical shorts in data centers' },
          { id: 'c4_4', text: 'Memory leaks in client CSS' }
        ],
        correctOptionIds: ['c4_1'],
        explanation: 'A circuit breaker trips to fast-fail requests when a service is failing repeatedly, preventing resource exhaustion and cascading failures.'
      },
      {
        id: 'c5',
        text: 'What is the primary role of a Reverse Proxy (such as Nginx or Envoy) in front of application servers?',
        marks: 10,
        options: [
          { id: 'c5_1', text: 'SSL termination, load balancing, request compression, and caching' },
          { id: 'c5_2', text: 'Compiling React components directly into binary machine code' },
          { id: 'c5_3', text: 'Hosting the primary SQL database tables' },
          { id: 'c5_4', text: 'Generating Bitcoin blocks' }
        ],
        correctOptionIds: ['c5_1'],
        explanation: 'Reverse proxies handle SSL termination, distribute traffic across nodes, apply rate limits, and cache responses.'
      }
    ]
  }
};

export const DEMO_EXAM_HISTORY: ExamHistoryItem[] = [
  {
    id: 'hist-1',
    examId: 'exam-4',
    examTitle: 'Certified Cloud Architect Practice Test',
    score: 40,
    maxScore: 50,
    percentage: 80,
    isPassed: true,
    date: '2026-11-04T14:30:00Z',
    durationMinutes: 22
  },
  {
    id: 'hist-2',
    examId: 'exam-2',
    examTitle: '2026 Fall Competitive Programming Regional',
    score: 50,
    maxScore: 60,
    percentage: 83.3,
    isPassed: true,
    date: '2026-10-28T18:00:00Z',
    durationMinutes: 52
  },
  {
    id: 'hist-3',
    examId: 'exam-1',
    examTitle: '2026 Fall CSE Web Development Midterm',
    score: 45,
    maxScore: 50,
    percentage: 90,
    isPassed: true,
    date: '2026-10-15T11:00:00Z',
    durationMinutes: 40
  }
];
