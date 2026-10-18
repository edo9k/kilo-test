const CONCEPT_GROUPS = {
  "workloads": [
    "pod", "job", "cronjob", "daemonset", "deployment", "statefulset",
    "replicaset", "rs", "rc", "hpa", "vpa", "sidecar"
  ],
  "networking": [
    "service", "ingress", "gateway", "networkpolicy", "cni", "dns", "svc",
    "istio", "envoy", "cilium", "calico", "traefik", "contour"
  ],
  "storage": [
    "pv", "pvc", "sc", "volume", "hostpath", "emptydir",
    "ceph", "rook", "longhorn", "portworx", "nfs"
  ],
  "config": [
    "configmap", "cm", "secret", "helm", "kustomize",
    "etcd", "argo", "argocd", "flux"
  ],
  "security": [
    "rbac", "sa", "role", "clusterrole", "psp", "psa",
    "tls", "jwt", "mtls", "saml", "oidc",
    "opa", "kyverno", "seccomp", "selinux", "apparmor", "falco", "trivy"
  ],
  "cli": [
    "kubectl", "kubeadm", "stern", "k9s", "kubectx", "kubens",
    "octant", "lens", "tilt", "kind", "minikube", "k3d", "ctlptl",
    "skaffold", "karpenter"
  ],
  "control-plane": [
    "etcd", "apiserver", "scheduler", "controller", "kubeproxy", "kubelet",
    "cp", "node", "rke", "eks", "gke", "aks", "kcp", "rancher", "k3s"
  ]
};

const WORD_MEANINGS = {
  "pod":          { "meaning": "Smallest deployable unit",            "link": "https://kubernetes.io/docs/concepts/workloads/pods/" },
  "job":          { "meaning": "Runs pods to completion",             "link": "https://kubernetes.io/docs/concepts/workloads/controllers/job/" },
  "cronjob":      { "meaning": "Runs jobs on a schedule",             "link": "https://kubernetes.io/docs/concepts/workloads/controllers/cronjob/" },
  "daemonset":    { "meaning": "Runs one pod per node",               "link": "https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/" },
  "deployment":   { "meaning": "Declarative pod updates",             "link": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" },
  "statefulset":  { "meaning": "Stateful application controller",     "link": "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/" },
  "replicaset":   { "meaning": "Maintains pod replica count",         "link": "https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/" },
  "rs":           { "meaning": "ReplicaSet shorthand",                "link": "https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/" },
  "rc":           { "meaning": "ReplicationController (legacy)",      "link": "https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/" },
  "hpa":          { "meaning": "Horizontal Pod Autoscaler",           "link": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" },
  "vpa":          { "meaning": "Vertical Pod Autoscaler",             "link": "https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler" },
  "sidecar":      { "meaning": "Helper container in a pod",           "link": "https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/" },

  "service":      { "meaning": "Network service abstraction",         "link": "https://kubernetes.io/docs/concepts/services-networking/service/" },
  "ingress":      { "meaning": "HTTP/HTTPS routing",                  "link": "https://kubernetes.io/docs/concepts/services-networking/ingress/" },
  "gateway":      { "meaning": "Gateway API routing",                 "link": "https://gateway-api.sigs.k8s.io/" },
  "networkpolicy":{ "meaning": "Pod traffic firewall",                "link": "https://kubernetes.io/docs/concepts/services-networking/network-policies/" },
  "cni":          { "meaning": "Container Network Interface",         "link": "https://github.com/containernetworking/cni" },
  "dns":          { "meaning": "Cluster DNS (CoreDNS)",               "link": "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/" },
  "svc":          { "meaning": "Service shorthand",                   "link": "https://kubernetes.io/docs/concepts/services-networking/service/" },
  "istio":        { "meaning": "Service mesh",                        "link": "https://istio.io/" },
  "envoy":        { "meaning": "Proxy used in service meshes",        "link": "https://www.envoyproxy.io/" },
  "cilium":       { "meaning": "eBPF-based CNI",                      "link": "https://cilium.io/" },
  "calico":       { "meaning": "CNI plugin",                          "link": "https://www.tigera.io/project-calico/" },
  "traefik":      { "meaning": "Ingress controller",                  "link": "https://traefik.io/" },
  "contour":      { "meaning": "Ingress controller",                  "link": "https://projectcontour.io/" },

  "pv":           { "meaning": "PersistentVolume",                    "link": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/" },
  "pvc":          { "meaning": "PersistentVolumeClaim",               "link": "https://kubernetes.io/docs/concepts/storage/persistent-volumes/" },
  "sc":           { "meaning": "StorageClass shorthand",              "link": "https://kubernetes.io/docs/concepts/storage/storage-classes/" },
  "volume":       { "meaning": "Pod volume",                          "link": "https://kubernetes.io/docs/concepts/storage/volumes/" },
  "hostpath":     { "meaning": "Host directory volume",               "link": "https://kubernetes.io/docs/concepts/storage/volumes/#hostpath" },
  "emptydir":     { "meaning": "Empty directory volume",              "link": "https://kubernetes.io/docs/concepts/storage/volumes/#emptydir" },
  "ceph":         { "meaning": "Distributed storage",                 "link": "https://ceph.io/" },
  "rook":         { "meaning": "Storage orchestrator",                "link": "https://rook.io/" },
  "longhorn":     { "meaning": "Cloud-native storage",                "link": "https://longhorn.io/" },
  "portworx":     { "meaning": "Storage platform",                    "link": "https://portworx.com/" },
  "nfs":          { "meaning": "NFS volume type",                     "link": "https://kubernetes.io/docs/concepts/storage/volumes/#nfs" },

  "configmap":    { "meaning": "Non-sensitive config data",           "link": "https://kubernetes.io/docs/concepts/configuration/configmap/" },
  "cm":           { "meaning": "ConfigMap shorthand",                 "link": "https://kubernetes.io/docs/concepts/configuration/configmap/" },
  "secret":       { "meaning": "Sensitive config data",               "link": "https://kubernetes.io/docs/concepts/configuration/secret/" },
  "helm":         { "meaning": "Package manager",                     "link": "https://helm.sh/" },
  "kustomize":    { "meaning": "Config customization",                "link": "https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/" },
  "etcd":         { "meaning": "Key-value store",                     "link": "https://etcd.io/" },
  "argo":         { "meaning": "Argo project",                        "link": "https://argoproj.github.io/" },
  "argocd":       { "meaning": "GitOps continuous delivery",          "link": "https://argo-cd.readthedocs.io/" },
  "flux":         { "meaning": "GitOps tool",                         "link": "https://fluxcd.io/" },

  "rbac":         { "meaning": "Role-Based Access Control",           "link": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" },
  "sa":           { "meaning": "ServiceAccount shorthand",            "link": "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/" },
  "role":         { "meaning": "RBAC Role",                           "link": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" },
  "clusterrole":  { "meaning": "Cluster-scoped RBAC Role",            "link": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" },
  "psp":          { "meaning": "PodSecurityPolicy (deprecated)",      "link": "https://kubernetes.io/docs/concepts/security/pod-security-policy/" },
  "psa":          { "meaning": "Pod Security Admission",              "link": "https://kubernetes.io/docs/concepts/security/pod-security-admission/" },
  "tls":          { "meaning": "Transport Layer Security",            "link": "https://kubernetes.io/docs/concepts/cluster-administration/certificates/" },
  "jwt":          { "meaning": "JSON Web Token",                      "link": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/" },
  "mtls":         { "meaning": "Mutual TLS",                          "link": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/" },
  "saml":         { "meaning": "SAML authentication",                 "link": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/" },
  "oidc":         { "meaning": "OpenID Connect",                      "link": "https://kubernetes.io/docs/reference/access-authn-authz/authentication/" },
  "opa":          { "meaning": "Open Policy Agent",                   "link": "https://www.openpolicyagent.org/" },
  "kyverno":      { "meaning": "Policy engine",                       "link": "https://kyverno.io/" },
  "seccomp":      { "meaning": "Syscall filter profiles",             "link": "https://kubernetes.io/docs/tutorials/security/seccomp/" },
  "selinux":      { "meaning": "Security-Enhanced Linux",             "link": "https://kubernetes.io/docs/tutorials/security/selinux/" },
  "apparmor":     { "meaning": "AppArmor profiles",                   "link": "https://kubernetes.io/docs/tutorials/security/apparmor/" },
  "falco":        { "meaning": "Runtime threat detection",            "link": "https://falco.org/" },
  "trivy":        { "meaning": "Vulnerability scanner",               "link": "https://trivy.dev/" },

  "kubectl":      { "meaning": "Kubernetes CLI",                      "link": "https://kubernetes.io/docs/reference/kubectl/" },
  "kubeadm":      { "meaning": "Cluster bootstrap tool",              "link": "https://kubernetes.io/docs/reference/setup-tools/kubeadm/" },
  "stern":        { "meaning": "Multi-pod log tailing",               "link": "https://github.com/stern/stern" },
  "k9s":          { "meaning": "Terminal UI",                         "link": "https://k9scli.io/" },
  "kubectx":      { "meaning": "Context switcher",                    "link": "https://github.com/ahmetb/kubectx" },
  "kubens":       { "meaning": "Namespace switcher",                  "link": "https://github.com/ahmetb/kubectx" },
  "octant":       { "meaning": "Web dashboard",                       "link": "https://github.com/vmware-archive/octant" },
  "lens":         { "meaning": "Kubernetes IDE",                      "link": "https://k8slens.dev/" },
  "tilt":         { "meaning": "Local dev workflow",                  "link": "https://tilt.dev/" },
  "kind":         { "meaning": "Local cluster in Docker",             "link": "https://kind.sigs.k8s.io/" },
  "minikube":     { "meaning": "Local single-node cluster",           "link": "https://minikube.sigs.k8s.io/" },
  "k3d":          { "meaning": "k3s in Docker",                       "link": "https://k3d.io/" },
  "ctlptl":       { "meaning": "Cluster tool for local dev",          "link": "https://github.com/tilt-dev/ctlptl" },
  "skaffold":     { "meaning": "Build/deploy workflow",               "link": "https://skaffold.dev/" },
  "karpenter":    { "meaning": "Node autoscaler",                     "link": "https://karpenter.sh/" },

  "apiserver":    { "meaning": "Control plane API server",            "link": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/" },
  "scheduler":    { "meaning": "Control plane scheduler",             "link": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/" },
  "controller":   { "meaning": "Controller manager",                  "link": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/" },
  "kubeproxy":    { "meaning": "Network proxy on nodes",              "link": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/" },
  "kubelet":      { "meaning": "Node agent",                          "link": "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/" },
  "cp":           { "meaning": "Control plane shorthand",             "link": "https://kubernetes.io/docs/reference/glossary/?all=true#term-control-plane" },
  "node":         { "meaning": "Worker machine",                      "link": "https://kubernetes.io/docs/concepts/architecture/nodes/" },
  "rke":          { "meaning": "Rancher Kubernetes Engine",           "link": "https://rancher.com/products/rke/" },
  "eks":          { "meaning": "Amazon Elastic Kubernetes Service",   "link": "https://aws.amazon.com/eks/" },
  "gke":          { "meaning": "Google Kubernetes Engine",            "link": "https://cloud.google.com/kubernetes-engine" },
  "aks":          { "meaning": "Azure Kubernetes Service",            "link": "https://azure.microsoft.com/en-us/products/kubernetes-service" },
  "kcp":          { "meaning": "Kubernetes Control Plane project",    "link": "https://kcp.io/" },
  "rancher":      { "meaning": "Kubernetes management platform",      "link": "https://rancher.com/" },
  "k3s":          { "meaning": "Lightweight Kubernetes distribution", "link": "https://k3s.io/" }
};

const WORD_BUCKETS = {
  3: [
    "pod", "job", "hpa", "vpa", "jwt", "cni", "dns", "svc", "opa",
    "gke", "eks", "nfs", "rke", "pvc", "psp", "psa", "tls",
    "k9s", "aks", "k3d", "kcp", "k3s", "csi"
  ],
  4: [
    "argo", "saml", "flux", "lens", "rbac", "tilt", "ceph", "rook",
    "helm", "role", "kind", "etcd", "oidc", "node", "mtls"
  ],
  5: [
    "istio", "envoy", "trivy", "falco", "stern"
  ],
  6: [
    "cilium", "octant", "calico", "ctlptl", "volume", "secret", "argocd", "kubens"
  ],
  7: [
    "cronjob", "kubectx", "sidecar", "kyverno", "rancher", "service",
    "ingress", "gateway", "traefik", "contour", "seccomp", "selinux",
    "kubectl", "kubelet", "kubeadm"
  ],
  8: [
    "hostpath", "emptydir", "longhorn", "portworx", "apparmor", "skaffold", "minikube"
  ],
  9: [
    "daemonset", "configmap", "kustomize", "scheduler", "kubeproxy",
    "karpenter", "apiserver"
  ],
  10: [
    "deployment", "replicaset", "controller"
  ]
};

const ALLOWED_GUESSES = {
  3: [
    "pod", "job", "hpa", "vpa", "jwt", "cni", "dns", "svc", "opa",
    "gke", "eks", "nfs", "rke", "pvc", "psp", "psa", "tls",
    "k9s", "aks", "k3d", "kcp", "k3s", "csi"
  ],
  4: [
    "argo", "saml", "flux", "lens", "rbac", "tilt", "ceph", "rook",
    "helm", "role", "kind", "etcd", "oidc", "node", "mtls"
  ],
  5: [
    "istio", "envoy", "trivy", "falco", "stern"
  ],
  6: [
    "cilium", "octant", "calico", "ctlptl", "volume", "secret", "argocd", "kubens"
  ],
  7: [
    "cronjob", "kubectx", "sidecar", "kyverno", "rancher", "service",
    "ingress", "gateway", "traefik", "contour", "seccomp", "selinux",
    "kubectl", "kubelet", "kubeadm"
  ],
  8: [
    "hostpath", "emptydir", "longhorn", "portworx", "apparmor", "skaffold", "minikube"
  ],
  9: [
    "daemonset", "configmap", "kustomize", "scheduler", "kubeproxy",
    "karpenter", "apiserver"
  ],
  10: [
    "deployment", "replicaset", "controller"
  ]
};

const WORDS = [
  // 3
  "pod", "job", "hpa", "vpa", "jwt", "cni", "dns", "svc", "opa",
  "gke", "eks", "nfs", "rke", "pvc", "psp", "psa", "tls",
  "k9s", "aks", "k3d", "kcp", "k3s", "csi",
  // 4
  "argo", "saml", "flux", "lens", "rbac", "tilt", "ceph", "rook",
  "helm", "role", "kind", "etcd", "oidc", "node", "mtls",
  // 5
  "istio", "envoy", "trivy", "falco", "stern",
  // 6
  "cilium", "octant", "calico", "ctlptl", "volume", "secret", "argocd", "kubens",
  // 7
  "cronjob", "kubectx", "sidecar", "kyverno", "rancher", "service",
  "ingress", "gateway", "traefik", "contour", "seccomp", "selinux",
  "kubectl", "kubelet", "kubeadm",
  // 8
  "hostpath", "emptydir", "longhorn", "portworx", "apparmor", "skaffold", "minikube",
  // 9
  "daemonset", "configmap", "kustomize", "scheduler", "kubeproxy",
  "karpenter", "apiserver",
  // 10
  "deployment", "replicaset", "controller"
];

try {
  if (typeof globalThis !== "undefined") {
    globalThis.CONCEPT_GROUPS = CONCEPT_GROUPS;
    globalThis.WORD_BUCKETS = WORD_BUCKETS;
    globalThis.ALLOWED_GUESSES = ALLOWED_GUESSES;
    globalThis.WORD_MEANINGS = WORD_MEANINGS;
    globalThis.WORDS = WORDS;
  }
  if (typeof window !== "undefined") {
    window.CONCEPT_GROUPS = CONCEPT_GROUPS;
    window.WORD_BUCKETS = WORD_BUCKETS;
    window.ALLOWED_GUESSES = ALLOWED_GUESSES;
    window.WORD_MEANINGS = WORD_MEANINGS;
    window.WORDS = WORDS;
  }
} catch (e) {}
