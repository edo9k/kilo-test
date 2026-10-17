// Kubernetes Wordle - Word Bank (concept groups)
const CONCEPT_GROUPS = {
  workloads: ['pod', 'job', 'cronjob', 'deployment', 'daemonset', 'statefulset', 'replicaset', 'hpa'],
  networking: ['service', 'ingress', 'endpoint', 'networkpolicy', 'cni', 'dns', 'svc', 'route'],
  storage: ['pv', 'pvc', 'sc', 'volume', 'ebs', 'efs', 'nfs', 'hostpath', 'emptydir'],
  config: ['configmap', 'secret', 'cm', 'env', 'yaml', 'helm', 'chart', 'kustomize'],
  security: ['rbac', 'sa', 'role', 'clusterrole', 'binding', 'psp', 'oidc', 'tls', 'cert', 'jwt'],
  cli: ['kubectl', 'kubelet', 'kubeadm', 'helm', 'stern', 'k9s', 'kubectx', 'kubens'],
  'control-plane': ['api', 'etcd', 'scheduler', 'controller', 'kubeproxy', 'proxy', 'cp', 'master', 'node']
};

// K8s terms with meanings and doc links
const WORD_MEANINGS = {
  pod: { meaning: 'Smallest deployable unit in Kubernetes; a group of containers', link: 'https://kubernetes.io/docs/concepts/workloads/pods/' },
  job: { meaning: 'Creates one or more pods and ensures they complete', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/job/' },
  cronjob: { meaning: 'Scheduled job that runs periodically', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/' },
  deployment: { meaning: 'Declarative updates for Pods and ReplicaSets', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' },
  daemonset: { meaning: 'Ensures all/selected nodes run a copy of a pod', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/' },
  statefulset: { meaning: 'Manages stateful applications with stable identities', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/' },
  replicaset: { meaning: 'Maintains a stable set of replica Pods', link: 'https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/' },
  hpa: { meaning: 'Horizontal Pod Autoscaler scales based on metrics', link: 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/' },
  service: { meaning: 'Abstract way to expose an application as a network service', link: 'https://kubernetes.io/docs/concepts/services-networking/service/' },
  ingress: { meaning: 'Manages external access to services (HTTP/HTTPS)', link: 'https://kubernetes.io/docs/concepts/services-networking/ingress/' },
  endpoint: { meaning: 'IP addresses of pods backing a Service', link: 'https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.29/#endpoints-v1-core' },
  networkpolicy: { meaning: 'Controls traffic flow between pods and networks', link: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/' },
  cni: { meaning: 'Container Network Interface plugins', link: 'https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/' },
  dns: { meaning: 'Cluster DNS for service discovery', link: 'https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/' },
  svc: { meaning: 'Short form of Service', link: 'https://kubernetes.io/docs/concepts/services-networking/service/' },
  route: { meaning: 'OpenShift route for external access', link: 'https://docs.openshift.com/container-platform/latest/networking/routes/route-configuration.html' },
  pv: { meaning: 'PersistentVolume - cluster storage resource', link: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/' },
  pvc: { meaning: 'PersistentVolumeClaim - request for storage', link: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims' },
  sc: { meaning: 'StorageClass - provisioner for dynamic PVs', link: 'https://kubernetes.io/docs/concepts/storage/storage-classes/' },
  volume: { meaning: 'Data storage accessible to containers in pod', link: 'https://kubernetes.io/docs/concepts/storage/volumes/' },
  ebs: { meaning: 'AWS Elastic Block Store (storage)', link: 'https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html' },
  efs: { meaning: 'AWS Elastic File System (storage)', link: 'https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html' },
  nfs: { meaning: 'Network File System (shared storage)', link: 'https://kubernetes.io/docs/concepts/storage/volumes/#nfs' },
  hostpath: { meaning: 'Volume mapped to host node filesystem', link: 'https://kubernetes.io/docs/concepts/storage/volumes/#hostpath' },
  emptydir: { meaning: 'Ephemeral volume for pod lifecycle', link: 'https://kubernetes.io/docs/concepts/storage/volumes/#emptydir' },
  configmap: { meaning: 'Stores non-confidential configuration data', link: 'https://kubernetes.io/docs/concepts/configuration/configmap/' },
  secret: { meaning: 'Stores sensitive data (base64 encoded)', link: 'https://kubernetes.io/docs/concepts/configuration/secret/' },
  cm: { meaning: 'Short form of ConfigMap', link: 'https://kubernetes.io/docs/concepts/configuration/configmap/' },
  env: { meaning: 'Environment variables for containers', link: 'https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/' },
  yaml: { meaning: 'YAML manifests define Kubernetes resources', link: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/' },
  helm: { meaning: 'Package manager for Kubernetes applications', link: 'https://helm.sh/docs/' },
  chart: { meaning: 'Helm package containing k8s manifests', link: 'https://helm.sh/docs/topics/charts/' },
  kustomize: { meaning: 'Customizes manifests without templating', link: 'https://kustomize.io/' },
  rbac: { meaning: 'Role-Based Access Control', link: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/' },
  sa: { meaning: 'ServiceAccount - identity for pods', link: 'https://kubernetes.io/docs/concepts/security/service-accounts/' },
  role: { meaning: 'RBAC role with permissions in namespace', link: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole' },
  clusterrole: { meaning: 'RBAC role with cluster-wide permissions', link: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole' },
  binding: { meaning: 'Binds Role/ClusterRole to subjects', link: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding' },
  psp: { meaning: 'Pod Security Policy (deprecated)', link: 'https://kubernetes.io/docs/concepts/security/pod-security-policy/' },
  oidc: { meaning: 'OpenID Connect for authentication', link: 'https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens' },
  tls: { meaning: 'Transport Layer Security for encryption', link: 'https://kubernetes.io/docs/tasks/tls/' },
  cert: { meaning: 'X.509 certificate for authentication', link: 'https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/' },
  jwt: { meaning: 'JSON Web Token for auth', link: 'https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens' },
  kubectl: { meaning: 'Kubernetes CLI tool', link: 'https://kubernetes.io/docs/reference/kubectl/' },
  kubelet: { meaning: 'Node agent that runs on each node', link: 'https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/' },
  kubeadm: { meaning: 'Tool to bootstrap Kubernetes clusters', link: 'https://kubernetes.io/docs/reference/setup-tools/kubeadm/' },
  stern: { meaning: 'Multi-pod log tailing tool', link: 'https://github.com/stern/stern' },
  k9s: { meaning: 'Terminal UI for Kubernetes', link: 'https://k9scli.io/' },
  kubectx: { meaning: 'Switch between Kubernetes contexts', link: 'https://github.com/ahmetb/kubectx' },
  kubens: { meaning: 'Switch between Kubernetes namespaces', link: 'https://github.com/ahmetb/kubectx' },
  api: { meaning: 'Kubernetes API server', link: 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/' },
  etcd: { meaning: 'Distributed key-value store for cluster data', link: 'https://kubernetes.io/docs/concepts/overview/components/#etcd' },
  scheduler: { meaning: 'Assigns pods to nodes', link: 'https://kubernetes.io/docs/concepts/overview/components/#kube-scheduler' },
  controller: { meaning: 'Control loop that regulates cluster state', link: 'https://kubernetes.io/docs/concepts/overview/components/#kube-controller-manager' },
  kubeproxy: { meaning: 'Network proxy on each node', link: 'https://kubernetes.io/docs/concepts/overview/components/#kube-proxy' },
  proxy: { meaning: 'Network proxy (kube-proxy)', link: 'https://kubernetes.io/docs/concepts/overview/components/#kube-proxy' },
  cp: { meaning: 'Control plane components', link: 'https://kubernetes.io/docs/concepts/overview/components/#control-plane-components' },
  master: { meaning: 'Legacy term for control plane node', link: 'https://kubernetes.io/docs/concepts/overview/components/' },
  node: { meaning: 'Worker machine in Kubernetes cluster', link: 'https://kubernetes.io/docs/concepts/architecture/nodes/' }
};

// Build words bucketed by length (3-10 chars)
function buildWordBuckets() {
  const buckets = {};
  for (let len = 3; len <= 10; len++) {
    buckets[len] = [];
  }
  for (const groupWords of Object.values(CONCEPT_GROUPS)) {
    for (const word of groupWords) {
      if (word.length >= 3 && word.length <= 10) {
        buckets[word.length].push(word);
      }
    }
  }
  // Deduplicate within each bucket (case-insensitive)
  for (let len = 3; len <= 10; len++) {
    const seen = new Set();
    const unique = [];
    for (const w of buckets[len]) {
      const key = w.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(key);
      }
    }
    buckets[len] = unique;
  }
  return buckets;
}

const WORD_BUCKETS = buildWordBuckets();

// Generate ALLOWED_GUESSES per length - start with same as WORDS, ensure >= 30
function buildAllowedGuesses() {
  const allowed = {};
  for (let len = 3; len <= 10; len++) {
    const set = new Set(WORD_BUCKETS[len] || []);
    // Add common k8s variations if needed to reach >= 30
    // Start with what's there; pad with more if under 30 (use WORD_BUCKETS merged conceptually)
    const all = [...set];
    // Try to add other valid concept terms if short
    for (const [group, words] of Object.entries(CONCEPT_GROUPS)) {
      for (const w of words) {
        if (w.length === len) {
          set.add(w.toLowerCase());
        }
      }
    }
    allowed[len] = Array.from(set);
  }
  return allowed;
}

const ALLOWED_GUESSES = buildAllowedGuesses();

// Build flat WORDS list (union across groups, deduped) for validation
const ALL_WORDS_SET = new Set();
for (const bucket of Object.values(WORD_BUCKETS)) {
  for (const w of bucket) ALL_WORDS_SET.add(w);
}
const WORDS = Array.from(ALL_WORDS_SET);
