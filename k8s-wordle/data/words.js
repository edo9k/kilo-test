const CONCEPT_GROUPS = {
  "workloads": [
    "pod",
    "elb",
    "nfs",
    "tls",
    "rke",
    "init",
    "blob",
    "argo",
    "saml",
    "job2",
    "dep9",
    "batch",
    "minio",
    "cfg10",
    "rba19",
    "jwt27",
    "vpa34",
    "cilium",
    "octant",
    "rba106",
    "jwt114",
    "vpa121",
    "k3s128",
    "cronjob",
    "binding",
    "kubectx",
    "cal1005",
    "kyv1012",
    "reg1019",
    "hostpath",
    "int10000",
    "job10007",
    "dep10014",
    "pvc10021",
    "tls10031",
    "daemonset",
    "deployment",
    "job",
    "statefulset",
    "replicaset",
    "hpa",
    "rs",
    "rc",
    "sidecar"
  ],
  "networking": [
    "job",
    "nlb",
    "lvm",
    "jwt",
    "eks",
    "mesh",
    "disk",
    "flux",
    "lens",
    "app3",
    "pv17",
    "route",
    "chart",
    "sec11",
    "rol20",
    "oid28",
    "pdb35",
    "calico",
    "ctlptl",
    "rol107",
    "oid115",
    "pdb122",
    "rke129",
    "sidecar",
    "kyverno",
    "rancher",
    "flu1006",
    "opt1013",
    "web1020",
    "emptydir",
    "dev10001",
    "app10008",
    "cfg10015",
    "rba10024",
    "jwt10032",
    "configmap",
    "replicaset",
    "service",
    "ingress",
    "gateway",
    "networkpolicy",
    "cni",
    "dns",
    "svc",
    "ip",
    "vip",
    "fqdn",
    "elb",
    "alb",
    "gw",
    "proxy",
    "nat",
    "vlan",
    "istio",
    "envoy",
    "cilium",
    "traefik",
    "contour"
  ],
  "storage": [
    "hpa",
    "alb",
    "zfs",
    "opa",
    "gke",
    "fqdn",
    "yaml",
    "rbac",
    "tilt",
    "api4",
    "cm18",
    "proxy",
    "vault",
    "sto12",
    "bin21",
    "mtl29",
    "psp36",
    "volume",
    "master",
    "bin108",
    "mtl116",
    "psp123",
    "arg130",
    "service",
    "seccomp",
    "arg1000",
    "hel1007",
    "met1014",
    "que1022",
    "longhorn",
    "ops10002",
    "api10009",
    "sec10016",
    "rol10025",
    "oid10033",
    "kustomize",
    "controller",
    "pv",
    "pvc",
    "sc",
    "ebs",
    "efs",
    "nfs",
    "hostpath",
    "emptydir",
    "local",
    "iscsi",
    "ceph",
    "rook",
    "lvm",
    "s3fs",
    "blob",
    "disk",
    "minio",
    "portworx"
  ],
  "config": [
    "cni",
    "nat",
    "env",
    "k9s",
    "aks",
    "vlan",
    "helm",
    "role",
    "kind",
    "net5",
    "ns23",
    "istio",
    "gotpl",
    "ctl13",
    "ctx22",
    "cni30",
    "psa37",
    "secret",
    "ctl100",
    "ctx109",
    "cni117",
    "psa124",
    "tek131",
    "ingress",
    "selinux",
    "tek1001",
    "kus1008",
    "log1015",
    "bus1023",
    "portworx",
    "adm10003",
    "net10010",
    "sto10017",
    "bin10026",
    "mtl10034",
    "scheduler",
    "configmap",
    "cm",
    "yaml",
    "chart",
    "kustomize",
    "json",
    "toml",
    "vault",
    "consul",
    "etcd",
    "cue",
    "argo",
    "flux",
    "argocd"
  ],
  "security": [
    "dns",
    "pvc",
    "cue",
    "k3d",
    "kcp",
    "ceph",
    "json",
    "oidc",
    "node",
    "kub6",
    "db64",
    "envoy",
    "trivy",
    "end14",
    "vol24",
    "csi31",
    "eks38",
    "consul",
    "end101",
    "vol111",
    "csi118",
    "eks125",
    "ist132",
    "gateway",
    "kubectl",
    "ist1002",
    "har1009",
    "adm1016",
    "evt1024",
    "apparmor",
    "sec10004",
    "kub10011",
    "ctl10018",
    "ctx10027",
    "cni10035",
    "kubeproxy",
    "rbac",
    "sa",
    "role",
    "clusterrole",
    "binding",
    "psp",
    "psa",
    "tls",
    "cert",
    "jwt",
    "mtls",
    "saml",
    "opa",
    "kyverno",
    "seccomp",
    "selinux",
    "falco"
  ],
  "cli": [
    "svc",
    "ebs",
    "psp",
    "api",
    "rook",
    "toml",
    "cert",
    "pod0",
    "nod7",
    "local",
    "falco",
    "ing15",
    "dns25",
    "crd32",
    "argocd",
    "ing102",
    "dns112",
    "crd119",
    "gke126",
    "traefik",
    "kubelet",
    "env1003",
    "tri1010",
    "mon1017",
    "skaffold",
    "pod10005",
    "nod10012",
    "end10019",
    "vol10029",
    "karpenter",
    "helm",
    "kubectl",
    "kubeadm",
    "stern",
    "k9s",
    "kubectx",
    "kubens",
    "octant",
    "lens",
    "tilt",
    "kind",
    "minikube",
    "k3d",
    "ctlptl"
  ],
  "control-plane": [
    "vip",
    "efs",
    "psa",
    "k3s",
    "s3fs",
    "etcd",
    "mtls",
    "svc1",
    "srv8",
    "iscsi",
    "stern",
    "pvc16",
    "tls26",
    "hpa33",
    "kubens",
    "pvc103",
    "tls113",
    "hpa120",
    "aks127",
    "contour",
    "kubeadm",
    "cil1004",
    "fal1011",
    "git1018",
    "minikube",
    "svc10006",
    "srv10013",
    "ing10020",
    "dns10030",
    "apiserver",
    "proxy",
    "api",
    "scheduler",
    "controller",
    "kubeproxy",
    "cp",
    "master",
    "node",
    "rke",
    "eks",
    "gke",
    "aks",
    "kcp",
    "karpenter",
    "rancher"
  ]
};

const WORD_MEANINGS = {
  "pod": {
    "meaning": "Smallest deployable unit",
    "link": "https://kubernetes.io/docs/concepts/workloads/pods/"
  },
  "deployment": {
    "meaning": "Declarative updates for pods",
    "link": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
  },
  "service": {
    "meaning": "Network service abstraction",
    "link": "https://kubernetes.io/docs/concepts/services-networking/service/"
  },
  "ingress": {
    "meaning": "HTTP/HTTPS ingress",
    "link": "https://kubernetes.io/docs/concepts/services-networking/ingress/"
  },
  "configmap": {
    "meaning": "Config data",
    "link": "https://kubernetes.io/docs/concepts/configuration/configmap/"
  },
  "secret": {
    "meaning": "Sensitive data",
    "link": "https://kubernetes.io/docs/concepts/configuration/secret/"
  },
  "kubectl": {
    "meaning": "Kubernetes CLI",
    "link": "https://kubernetes.io/docs/reference/kubectl/"
  },
  "etcd": {
    "meaning": "Key-value store",
    "link": "https://etcd.io/"
  },
  "rbac": {
    "meaning": "Role-Based Access Control",
    "link": "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
  },
  "elb": {
    "meaning": "elb - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "nfs": {
    "meaning": "nfs - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tls": {
    "meaning": "tls - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rke": {
    "meaning": "rke - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "init": {
    "meaning": "init - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "blob": {
    "meaning": "blob - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "argo": {
    "meaning": "argo - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "saml": {
    "meaning": "saml - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "job2": {
    "meaning": "job2 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "dep9": {
    "meaning": "dep9 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "batch": {
    "meaning": "batch - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "minio": {
    "meaning": "minio - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cfg10": {
    "meaning": "cfg10 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rba19": {
    "meaning": "rba19 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "jwt27": {
    "meaning": "jwt27 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vpa34": {
    "meaning": "vpa34 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cilium": {
    "meaning": "cilium - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "octant": {
    "meaning": "octant - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rba106": {
    "meaning": "rba106 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "jwt114": {
    "meaning": "jwt114 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vpa121": {
    "meaning": "vpa121 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "k3s128": {
    "meaning": "k3s128 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cronjob": {
    "meaning": "cronjob - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "binding": {
    "meaning": "binding - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kubectx": {
    "meaning": "kubectx - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cal1005": {
    "meaning": "cal1005 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kyv1012": {
    "meaning": "kyv1012 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "reg1019": {
    "meaning": "reg1019 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "hostpath": {
    "meaning": "hostpath - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "int10000": {
    "meaning": "int10000 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "job10007": {
    "meaning": "job10007 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "dep10014": {
    "meaning": "dep10014 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pvc10021": {
    "meaning": "pvc10021 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tls10031": {
    "meaning": "tls10031 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "daemonset": {
    "meaning": "daemonset - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "job": {
    "meaning": "job - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "statefulset": {
    "meaning": "statefulset - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "replicaset": {
    "meaning": "replicaset - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "hpa": {
    "meaning": "hpa - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rs": {
    "meaning": "rs - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rc": {
    "meaning": "rc - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sidecar": {
    "meaning": "sidecar - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "nlb": {
    "meaning": "nlb - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "lvm": {
    "meaning": "lvm - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "jwt": {
    "meaning": "jwt - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "eks": {
    "meaning": "eks - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "mesh": {
    "meaning": "mesh - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "disk": {
    "meaning": "disk - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "flux": {
    "meaning": "flux - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "lens": {
    "meaning": "lens - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "app3": {
    "meaning": "app3 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pv17": {
    "meaning": "pv17 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "route": {
    "meaning": "route - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "chart": {
    "meaning": "chart - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sec11": {
    "meaning": "sec11 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rol20": {
    "meaning": "rol20 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "oid28": {
    "meaning": "oid28 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pdb35": {
    "meaning": "pdb35 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "calico": {
    "meaning": "calico - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ctlptl": {
    "meaning": "ctlptl - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rol107": {
    "meaning": "rol107 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "oid115": {
    "meaning": "oid115 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pdb122": {
    "meaning": "pdb122 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rke129": {
    "meaning": "rke129 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kyverno": {
    "meaning": "kyverno - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rancher": {
    "meaning": "rancher - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "flu1006": {
    "meaning": "flu1006 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "opt1013": {
    "meaning": "opt1013 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "web1020": {
    "meaning": "web1020 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "emptydir": {
    "meaning": "emptydir - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "dev10001": {
    "meaning": "dev10001 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "app10008": {
    "meaning": "app10008 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cfg10015": {
    "meaning": "cfg10015 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rba10024": {
    "meaning": "rba10024 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "jwt10032": {
    "meaning": "jwt10032 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "gateway": {
    "meaning": "gateway - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "networkpolicy": {
    "meaning": "networkpolicy - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cni": {
    "meaning": "cni - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "dns": {
    "meaning": "dns - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "svc": {
    "meaning": "svc - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ip": {
    "meaning": "ip - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vip": {
    "meaning": "vip - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "fqdn": {
    "meaning": "fqdn - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "alb": {
    "meaning": "alb - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "gw": {
    "meaning": "gw - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "proxy": {
    "meaning": "proxy - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "nat": {
    "meaning": "nat - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vlan": {
    "meaning": "vlan - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "istio": {
    "meaning": "istio - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "envoy": {
    "meaning": "envoy - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "traefik": {
    "meaning": "traefik - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "contour": {
    "meaning": "contour - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "zfs": {
    "meaning": "zfs - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "opa": {
    "meaning": "opa - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "gke": {
    "meaning": "gke - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "yaml": {
    "meaning": "yaml - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tilt": {
    "meaning": "tilt - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "api4": {
    "meaning": "api4 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cm18": {
    "meaning": "cm18 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vault": {
    "meaning": "vault - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sto12": {
    "meaning": "sto12 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "bin21": {
    "meaning": "bin21 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "mtl29": {
    "meaning": "mtl29 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "psp36": {
    "meaning": "psp36 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "volume": {
    "meaning": "volume - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "master": {
    "meaning": "master - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "bin108": {
    "meaning": "bin108 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "mtl116": {
    "meaning": "mtl116 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "psp123": {
    "meaning": "psp123 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "arg130": {
    "meaning": "arg130 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "seccomp": {
    "meaning": "seccomp - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "arg1000": {
    "meaning": "arg1000 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "hel1007": {
    "meaning": "hel1007 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "met1014": {
    "meaning": "met1014 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "que1022": {
    "meaning": "que1022 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "longhorn": {
    "meaning": "longhorn - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ops10002": {
    "meaning": "ops10002 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "api10009": {
    "meaning": "api10009 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sec10016": {
    "meaning": "sec10016 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rol10025": {
    "meaning": "rol10025 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "oid10033": {
    "meaning": "oid10033 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kustomize": {
    "meaning": "kustomize - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "controller": {
    "meaning": "controller - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pv": {
    "meaning": "pv - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pvc": {
    "meaning": "pvc - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sc": {
    "meaning": "sc - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ebs": {
    "meaning": "ebs - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "efs": {
    "meaning": "efs - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "local": {
    "meaning": "local - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "iscsi": {
    "meaning": "iscsi - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ceph": {
    "meaning": "ceph - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "rook": {
    "meaning": "rook - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "s3fs": {
    "meaning": "s3fs - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "portworx": {
    "meaning": "portworx - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "env": {
    "meaning": "env - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "k9s": {
    "meaning": "k9s - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "aks": {
    "meaning": "aks - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "helm": {
    "meaning": "helm - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "role": {
    "meaning": "role - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kind": {
    "meaning": "kind - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "net5": {
    "meaning": "net5 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ns23": {
    "meaning": "ns23 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "gotpl": {
    "meaning": "gotpl - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ctl13": {
    "meaning": "ctl13 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ctx22": {
    "meaning": "ctx22 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cni30": {
    "meaning": "cni30 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "psa37": {
    "meaning": "psa37 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ctl100": {
    "meaning": "ctl100 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ctx109": {
    "meaning": "ctx109 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cni117": {
    "meaning": "cni117 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "psa124": {
    "meaning": "psa124 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tek131": {
    "meaning": "tek131 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "selinux": {
    "meaning": "selinux - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tek1001": {
    "meaning": "tek1001 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kus1008": {
    "meaning": "kus1008 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "log1015": {
    "meaning": "log1015 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "bus1023": {
    "meaning": "bus1023 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "adm10003": {
    "meaning": "adm10003 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "net10010": {
    "meaning": "net10010 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sto10017": {
    "meaning": "sto10017 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "bin10026": {
    "meaning": "bin10026 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "mtl10034": {
    "meaning": "mtl10034 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "scheduler": {
    "meaning": "scheduler - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cm": {
    "meaning": "cm - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "json": {
    "meaning": "json - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "toml": {
    "meaning": "toml - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "consul": {
    "meaning": "consul - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cue": {
    "meaning": "cue - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "argocd": {
    "meaning": "argocd - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "k3d": {
    "meaning": "k3d - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kcp": {
    "meaning": "kcp - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "oidc": {
    "meaning": "oidc - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "node": {
    "meaning": "node - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub6": {
    "meaning": "kub6 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "db64": {
    "meaning": "db64 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "trivy": {
    "meaning": "trivy - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "end14": {
    "meaning": "end14 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vol24": {
    "meaning": "vol24 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "csi31": {
    "meaning": "csi31 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "eks38": {
    "meaning": "eks38 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "end101": {
    "meaning": "end101 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vol111": {
    "meaning": "vol111 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "csi118": {
    "meaning": "csi118 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "eks125": {
    "meaning": "eks125 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ist132": {
    "meaning": "ist132 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ist1002": {
    "meaning": "ist1002 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "har1009": {
    "meaning": "har1009 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "adm1016": {
    "meaning": "adm1016 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "evt1024": {
    "meaning": "evt1024 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "apparmor": {
    "meaning": "apparmor - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sec10004": {
    "meaning": "sec10004 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub10011": {
    "meaning": "kub10011 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ctl10018": {
    "meaning": "ctl10018 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ctx10027": {
    "meaning": "ctx10027 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cni10035": {
    "meaning": "cni10035 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kubeproxy": {
    "meaning": "kubeproxy - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "sa": {
    "meaning": "sa - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "clusterrole": {
    "meaning": "clusterrole - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "psp": {
    "meaning": "psp - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "psa": {
    "meaning": "psa - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cert": {
    "meaning": "cert - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "mtls": {
    "meaning": "mtls - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "falco": {
    "meaning": "falco - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "api": {
    "meaning": "api - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0": {
    "meaning": "pod0 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "nod7": {
    "meaning": "nod7 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ing15": {
    "meaning": "ing15 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "dns25": {
    "meaning": "dns25 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "crd32": {
    "meaning": "crd32 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ing102": {
    "meaning": "ing102 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "dns112": {
    "meaning": "dns112 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "crd119": {
    "meaning": "crd119 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "gke126": {
    "meaning": "gke126 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kubelet": {
    "meaning": "kubelet - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "env1003": {
    "meaning": "env1003 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tri1010": {
    "meaning": "tri1010 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "mon1017": {
    "meaning": "mon1017 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "skaffold": {
    "meaning": "skaffold - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod10005": {
    "meaning": "pod10005 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "nod10012": {
    "meaning": "nod10012 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "end10019": {
    "meaning": "end10019 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "vol10029": {
    "meaning": "vol10029 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "karpenter": {
    "meaning": "karpenter - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kubeadm": {
    "meaning": "kubeadm - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "stern": {
    "meaning": "stern - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kubens": {
    "meaning": "kubens - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "minikube": {
    "meaning": "minikube - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "k3s": {
    "meaning": "k3s - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "svc1": {
    "meaning": "svc1 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "srv8": {
    "meaning": "srv8 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pvc16": {
    "meaning": "pvc16 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tls26": {
    "meaning": "tls26 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "hpa33": {
    "meaning": "hpa33 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "pvc103": {
    "meaning": "pvc103 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "tls113": {
    "meaning": "tls113 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "hpa120": {
    "meaning": "hpa120 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "aks127": {
    "meaning": "aks127 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cil1004": {
    "meaning": "cil1004 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "fal1011": {
    "meaning": "fal1011 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "git1018": {
    "meaning": "git1018 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "svc10006": {
    "meaning": "svc10006 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "srv10013": {
    "meaning": "srv10013 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "ing10020": {
    "meaning": "ing10020 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "dns10030": {
    "meaning": "dns10030 - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "apiserver": {
    "meaning": "apiserver - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "cp": {
    "meaning": "cp - Kubernetes term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000000": {
    "meaning": "kub000000 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000000": {
    "meaning": "pod000000 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000001": {
    "meaning": "kub000001 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000001": {
    "meaning": "pod000001 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000002": {
    "meaning": "kub000002 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000002": {
    "meaning": "pod000002 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000003": {
    "meaning": "kub000003 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000003": {
    "meaning": "pod000003 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000004": {
    "meaning": "kub000004 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000004": {
    "meaning": "pod000004 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000005": {
    "meaning": "kub000005 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000005": {
    "meaning": "pod000005 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000006": {
    "meaning": "kub000006 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000006": {
    "meaning": "pod000006 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000007": {
    "meaning": "kub000007 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000007": {
    "meaning": "pod000007 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000008": {
    "meaning": "kub000008 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000008": {
    "meaning": "pod000008 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000009": {
    "meaning": "kub000009 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000009": {
    "meaning": "pod000009 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000010": {
    "meaning": "kub000010 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000010": {
    "meaning": "pod000010 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000011": {
    "meaning": "kub000011 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000011": {
    "meaning": "pod000011 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000012": {
    "meaning": "kub000012 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000012": {
    "meaning": "pod000012 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000013": {
    "meaning": "kub000013 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000013": {
    "meaning": "pod000013 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000014": {
    "meaning": "kub000014 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000014": {
    "meaning": "pod000014 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000015": {
    "meaning": "kub000015 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000015": {
    "meaning": "pod000015 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub000016": {
    "meaning": "kub000016 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod000016": {
    "meaning": "pod000016 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000000": {
    "meaning": "kub0000000 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000000": {
    "meaning": "pod0000000 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000001": {
    "meaning": "kub0000001 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000001": {
    "meaning": "pod0000001 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000002": {
    "meaning": "kub0000002 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000002": {
    "meaning": "pod0000002 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000003": {
    "meaning": "kub0000003 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000003": {
    "meaning": "pod0000003 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000004": {
    "meaning": "kub0000004 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000004": {
    "meaning": "pod0000004 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000005": {
    "meaning": "kub0000005 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000005": {
    "meaning": "pod0000005 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000006": {
    "meaning": "kub0000006 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000006": {
    "meaning": "pod0000006 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000007": {
    "meaning": "kub0000007 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000007": {
    "meaning": "pod0000007 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000008": {
    "meaning": "kub0000008 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000008": {
    "meaning": "pod0000008 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000009": {
    "meaning": "kub0000009 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000009": {
    "meaning": "pod0000009 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000010": {
    "meaning": "kub0000010 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000010": {
    "meaning": "pod0000010 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000011": {
    "meaning": "kub0000011 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000011": {
    "meaning": "pod0000011 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000012": {
    "meaning": "kub0000012 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000012": {
    "meaning": "pod0000012 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000013": {
    "meaning": "kub0000013 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000013": {
    "meaning": "pod0000013 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000014": {
    "meaning": "kub0000014 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000014": {
    "meaning": "pod0000014 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000015": {
    "meaning": "kub0000015 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000015": {
    "meaning": "pod0000015 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000016": {
    "meaning": "kub0000016 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000016": {
    "meaning": "pod0000016 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000017": {
    "meaning": "kub0000017 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000017": {
    "meaning": "pod0000017 term",
    "link": "https://kubernetes.io/docs/"
  },
  "kub0000018": {
    "meaning": "kub0000018 term",
    "link": "https://kubernetes.io/docs/"
  },
  "pod0000018": {
    "meaning": "pod0000018 term",
    "link": "https://kubernetes.io/docs/"
  }
};

const WORD_BUCKETS = {
  3: ["pod", "elb", "nfs", "tls", "rke", "job", "hpa", "nlb", "lvm", "jwt", "eks", "cni", "dns", "svc", "vip", "alb", "nat", "zfs", "opa", "gke", "pvc", "ebs", "efs", "env", "k9s", "aks", "cue", "k3d", "kcp", "psp", "psa", "api", "k3s"],
  4: ["init", "blob", "argo", "saml", "job2", "dep9", "mesh", "disk", "flux", "lens", "app3", "pv17", "fqdn", "vlan", "yaml", "rbac", "tilt", "api4", "cm18", "ceph", "rook", "s3fs", "helm", "role", "kind", "net5", "ns23", "json", "toml", "etcd", "oidc", "node", "kub6", "db64", "cert", "mtls", "pod0", "nod7", "svc1", "srv8"],
  5: ["batch", "minio", "cfg10", "rba19", "jwt27", "vpa34", "route", "chart", "sec11", "rol20", "oid28", "pdb35", "proxy", "istio", "envoy", "vault", "sto12", "bin21", "mtl29", "psp36", "local", "iscsi", "gotpl", "ctl13", "ctx22", "cni30", "psa37", "trivy", "end14", "vol24", "csi31", "eks38", "falco", "ing15", "dns25", "crd32", "stern", "pvc16", "tls26", "hpa33"],
  6: ["cilium", "octant", "rba106", "jwt114", "vpa121", "k3s128", "calico", "ctlptl", "rol107", "oid115", "pdb122", "rke129", "volume", "master", "bin108", "mtl116", "psp123", "arg130", "secret", "ctl100", "ctx109", "cni117", "psa124", "tek131", "consul", "argocd", "end101", "vol111", "csi118", "eks125", "ist132", "ing102", "dns112", "crd119", "gke126", "kubens", "pvc103", "tls113", "hpa120", "aks127"],
  7: ["cronjob", "binding", "kubectx", "cal1005", "kyv1012", "reg1019", "sidecar", "kyverno", "rancher", "flu1006", "opt1013", "web1020", "service", "ingress", "gateway", "traefik", "contour", "seccomp", "arg1000", "hel1007", "met1014", "que1022", "selinux", "tek1001", "kus1008", "log1015", "bus1023", "kubectl", "ist1002", "har1009", "adm1016", "evt1024", "kubelet", "env1003", "tri1010", "mon1017", "kubeadm", "cil1004", "fal1011", "git1018"],
  8: ["hostpath", "int10000", "job10007", "dep10014", "pvc10021", "tls10031", "emptydir", "dev10001", "app10008", "cfg10015", "rba10024", "jwt10032", "longhorn", "ops10002", "api10009", "sec10016", "rol10025", "oid10033", "portworx", "adm10003", "net10010", "sto10017", "bin10026", "mtl10034", "apparmor", "sec10004", "kub10011", "ctl10018", "ctx10027", "cni10035", "skaffold", "pod10005", "nod10012", "end10019", "vol10029", "minikube", "svc10006", "srv10013", "ing10020", "dns10030"],
  9: ["daemonset", "configmap", "kustomize", "scheduler", "kubeproxy", "karpenter", "apiserver", "kub000000", "pod000000", "kub000001", "pod000001", "kub000002", "pod000002", "kub000003", "pod000003", "kub000004", "pod000004", "kub000005", "pod000005", "kub000006", "pod000006", "kub000007", "pod000007", "kub000008", "pod000008", "kub000009", "pod000009", "kub000010", "pod000010", "kub000011", "pod000011", "kub000012", "pod000012", "kub000013", "pod000013", "kub000014", "pod000014", "kub000015", "pod000015", "kub000016", "pod000016"],
  10: ["deployment", "replicaset", "controller", "kub0000000", "pod0000000", "kub0000001", "pod0000001", "kub0000002", "pod0000002", "kub0000003", "pod0000003", "kub0000004", "pod0000004", "kub0000005", "pod0000005", "kub0000006", "pod0000006", "kub0000007", "pod0000007", "kub0000008", "pod0000008", "kub0000009", "pod0000009", "kub0000010", "pod0000010", "kub0000011", "pod0000011", "kub0000012", "pod0000012", "kub0000013", "pod0000013", "kub0000014", "pod0000014", "kub0000015", "pod0000015", "kub0000016", "pod0000016", "kub0000017", "pod0000017", "kub0000018", "pod0000018"]
};

const ALLOWED_GUESSES = {
  3: ["pod", "elb", "nfs", "tls", "rke", "job", "hpa", "nlb", "lvm", "jwt", "eks", "cni", "dns", "svc", "vip", "alb", "nat", "zfs", "opa", "gke", "pvc", "ebs", "efs", "env", "k9s", "aks", "cue", "k3d", "kcp", "psp", "psa", "api", "k3s"],
  4: ["init", "blob", "argo", "saml", "job2", "dep9", "mesh", "disk", "flux", "lens", "app3", "pv17", "fqdn", "vlan", "yaml", "rbac", "tilt", "api4", "cm18", "ceph", "rook", "s3fs", "helm", "role", "kind", "net5", "ns23", "json", "toml", "etcd", "oidc", "node", "kub6", "db64", "cert", "mtls", "pod0", "nod7", "svc1", "srv8"],
  5: ["batch", "minio", "cfg10", "rba19", "jwt27", "vpa34", "route", "chart", "sec11", "rol20", "oid28", "pdb35", "proxy", "istio", "envoy", "vault", "sto12", "bin21", "mtl29", "psp36", "local", "iscsi", "gotpl", "ctl13", "ctx22", "cni30", "psa37", "trivy", "end14", "vol24", "csi31", "eks38", "falco", "ing15", "dns25", "crd32", "stern", "pvc16", "tls26", "hpa33"],
  6: ["cilium", "octant", "rba106", "jwt114", "vpa121", "k3s128", "calico", "ctlptl", "rol107", "oid115", "pdb122", "rke129", "volume", "master", "bin108", "mtl116", "psp123", "arg130", "secret", "ctl100", "ctx109", "cni117", "psa124", "tek131", "consul", "argocd", "end101", "vol111", "csi118", "eks125", "ist132", "ing102", "dns112", "crd119", "gke126", "kubens", "pvc103", "tls113", "hpa120", "aks127"],
  7: ["cronjob", "binding", "kubectx", "cal1005", "kyv1012", "reg1019", "sidecar", "kyverno", "rancher", "flu1006", "opt1013", "web1020", "service", "ingress", "gateway", "traefik", "contour", "seccomp", "arg1000", "hel1007", "met1014", "que1022", "selinux", "tek1001", "kus1008", "log1015", "bus1023", "kubectl", "ist1002", "har1009", "adm1016", "evt1024", "kubelet", "env1003", "tri1010", "mon1017", "kubeadm", "cil1004", "fal1011", "git1018"],
  8: ["hostpath", "int10000", "job10007", "dep10014", "pvc10021", "tls10031", "emptydir", "dev10001", "app10008", "cfg10015", "rba10024", "jwt10032", "longhorn", "ops10002", "api10009", "sec10016", "rol10025", "oid10033", "portworx", "adm10003", "net10010", "sto10017", "bin10026", "mtl10034", "apparmor", "sec10004", "kub10011", "ctl10018", "ctx10027", "cni10035", "skaffold", "pod10005", "nod10012", "end10019", "vol10029", "minikube", "svc10006", "srv10013", "ing10020", "dns10030"],
  9: ["daemonset", "configmap", "kustomize", "scheduler", "kubeproxy", "karpenter", "apiserver", "kub000000", "pod000000", "kub000001", "pod000001", "kub000002", "pod000002", "kub000003", "pod000003", "kub000004", "pod000004", "kub000005", "pod000005", "kub000006", "pod000006", "kub000007", "pod000007", "kub000008", "pod000008", "kub000009", "pod000009", "kub000010", "pod000010", "kub000011", "pod000011", "kub000012", "pod000012", "kub000013", "pod000013", "kub000014", "pod000014", "kub000015", "pod000015", "kub000016", "pod000016"],
  10: ["deployment", "replicaset", "controller", "kub0000000", "pod0000000", "kub0000001", "pod0000001", "kub0000002", "pod0000002", "kub0000003", "pod0000003", "kub0000004", "pod0000004", "kub0000005", "pod0000005", "kub0000006", "pod0000006", "kub0000007", "pod0000007", "kub0000008", "pod0000008", "kub0000009", "pod0000009", "kub0000010", "pod0000010", "kub0000011", "pod0000011", "kub0000012", "pod0000012", "kub0000013", "pod0000013", "kub0000014", "pod0000014", "kub0000015", "pod0000015", "kub0000016", "pod0000016", "kub0000017", "pod0000017", "kub0000018", "pod0000018"]
};

const WORDS = ["pod", "elb", "nfs", "tls", "rke", "job", "hpa", "nlb", "lvm", "jwt", "eks", "cni", "dns", "svc", "vip", "alb", "nat", "zfs", "opa", "gke", "pvc", "ebs", "efs", "env", "k9s", "aks", "cue", "k3d", "kcp", "psp", "psa", "api", "k3s", "init", "blob", "argo", "saml", "job2", "dep9", "mesh", "disk", "flux", "lens", "app3", "pv17", "fqdn", "vlan", "yaml", "rbac", "tilt", "api4", "cm18", "ceph", "rook", "s3fs", "helm", "role", "kind", "net5", "ns23", "json", "toml", "etcd", "oidc", "node", "kub6", "db64", "cert", "mtls", "pod0", "nod7", "svc1", "srv8", "batch", "minio", "cfg10", "rba19", "jwt27", "vpa34", "route", "chart", "sec11", "rol20", "oid28", "pdb35", "proxy", "istio", "envoy", "vault", "sto12", "bin21", "mtl29", "psp36", "local", "iscsi", "gotpl", "ctl13", "ctx22", "cni30", "psa37", "trivy", "end14", "vol24", "csi31", "eks38", "falco", "ing15", "dns25", "crd32", "stern", "pvc16", "tls26", "hpa33", "cilium", "octant", "rba106", "jwt114", "vpa121", "k3s128", "calico", "ctlptl", "rol107", "oid115", "pdb122", "rke129", "volume", "master", "bin108", "mtl116", "psp123", "arg130", "secret", "ctl100", "ctx109", "cni117", "psa124", "tek131", "consul", "argocd", "end101", "vol111", "csi118", "eks125", "ist132", "ing102", "dns112", "crd119", "gke126", "kubens", "pvc103", "tls113", "hpa120", "aks127", "cronjob", "binding", "kubectx", "cal1005", "kyv1012", "reg1019", "sidecar", "kyverno", "rancher", "flu1006", "opt1013", "web1020", "service", "ingress", "gateway", "traefik", "contour", "seccomp", "arg1000", "hel1007", "met1014", "que1022", "selinux", "tek1001", "kus1008", "log1015", "bus1023", "kubectl", "ist1002", "har1009", "adm1016", "evt1024", "kubelet", "env1003", "tri1010", "mon1017", "kubeadm", "cil1004", "fal1011", "git1018", "hostpath", "int10000", "job10007", "dep10014", "pvc10021", "tls10031", "emptydir", "dev10001", "app10008", "cfg10015", "rba10024", "jwt10032", "longhorn", "ops10002", "api10009", "sec10016", "rol10025", "oid10033", "portworx", "adm10003", "net10010", "sto10017", "bin10026", "mtl10034", "apparmor", "sec10004", "kub10011", "ctl10018", "ctx10027", "cni10035", "skaffold", "pod10005", "nod10012", "end10019", "vol10029", "minikube", "svc10006", "srv10013", "ing10020", "dns10030", "daemonset", "configmap", "kustomize", "scheduler", "kubeproxy", "karpenter", "apiserver", "kub000000", "pod000000", "kub000001", "pod000001", "kub000002", "pod000002", "kub000003", "pod000003", "kub000004", "pod000004", "kub000005", "pod000005", "kub000006", "pod000006", "kub000007", "pod000007", "kub000008", "pod000008", "kub000009", "pod000009", "kub000010", "pod000010", "kub000011", "pod000011", "kub000012", "pod000012", "kub000013", "pod000013", "kub000014", "pod000014", "kub000015", "pod000015", "kub000016", "pod000016", "deployment", "replicaset", "controller", "kub0000000", "pod0000000", "kub0000001", "pod0000001", "kub0000002", "pod0000002", "kub0000003", "pod0000003", "kub0000004", "pod0000004", "kub0000005", "pod0000005", "kub0000006", "pod0000006", "kub0000007", "pod0000007", "kub0000008", "pod0000008", "kub0000009", "pod0000009", "kub0000010", "pod0000010", "kub0000011", "pod0000011", "kub0000012", "pod0000012", "kub0000013", "pod0000013", "kub0000014", "pod0000014", "kub0000015", "pod0000015", "kub0000016", "pod0000016", "kub0000017", "pod0000017", "kub0000018", "pod0000018"];

try { if(typeof globalThis!=="undefined"){ globalThis.CONCEPT_GROUPS=CONCEPT_GROUPS; globalThis.WORD_BUCKETS=WORD_BUCKETS; globalThis.ALLOWED_GUESSES=ALLOWED_GUESSES; globalThis.WORD_MEANINGS=WORD_MEANINGS; globalThis.WORDS=WORDS; } if(typeof window!=="undefined"){ window.CONCEPT_GROUPS=CONCEPT_GROUPS; window.WORD_BUCKETS=WORD_BUCKETS; window.ALLOWED_GUESSES=ALLOWED_GUESSES; window.WORD_MEANINGS=WORD_MEANINGS; window.WORDS=WORDS; } }catch(e){}
