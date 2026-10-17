--------------------------- MODULE K8sUpgrade ---------------------------

EXTENDS Naturals, FiniteSets

CONSTANTS Apps, MaxParallel

ASSUME Apps # {}

HelmDir == "/usr/local/share/applications/helm"

Status == {"NotStarted", "Upgrading", "Upgraded", "Failed"}

VARIABLES status, active, completed, failed

vars == <<status, active, completed, failed>>

TypeOK ==
  /\ status \in [Apps -> Status]
  /\ active \subseteq Apps
  /\ completed \subseteq Apps
  /\ failed \subseteq Apps

NoOverlap ==
  /\ active \cap completed = {}
  /\ active \cap failed = {}
  /\ completed \cap failed = {}

Partition ==
  Apps = active \cup completed \cup failed \cup {r \in Apps : status[r] = "NotStarted"}

Capacity == Cardinality(active) <= MaxParallel

Invariant == TypeOK /\ NoOverlap /\ Partition /\ Capacity

Init ==
  /\ status = [r \in Apps |-> "NotStarted"]
  /\ active = {}
  /\ completed = {}
  /\ failed = {}

StartUpgrade(r) ==
  /\ r \in Apps
  /\ status[r] = "NotStarted"
  /\ Cardinality(active) < MaxParallel
  /\ status' = [status EXCEPT ![r] = "Upgrading"]
  /\ active' = active \union {r}
  /\ UNCHANGED <<completed, failed>>

CompleteUpgrade(r) ==
  /\ r \in active
  /\ status' = [status EXCEPT ![r] = CHOOSE s \in {"Upgraded", "Failed"} : TRUE]
  /\ active' = active \ {r}
  /\ IF status'[r] = "Upgraded"
       THEN /\ completed' = completed \union {r}
            /\ failed' = failed
       ELSE /\ completed' = completed
            /\ failed' = failed \union {r}

Next ==
  \/ \E r \in Apps : StartUpgrade(r)
  \/ \E r \in Apps : CompleteUpgrade(r)

Spec == Init /\ [][Next]_vars

\* PlusCal algorithm
--algorithm HelmUpgrade {
  variables {
    status \in [Apps -> {"NotStarted"}];
    active = {};
    completed = {};
    failed = {};
  }

  while (TRUE) {
    either {
      await (Cardinality(active) < MaxParallel) /\ (Apps \ (active \cup completed \cup failed)) # {};
      with (r \in Apps \ (active \cup completed \cup failed)) {
        status[r] := "Upgrading";
        active := active \union {r};
      }
    } or {
      await active # {};
      with (r \in active) {
        either {
          status[r] := "Upgraded";
          active := active \ {r};
          completed := completed \union {r};
        } or {
          status[r] := "Failed";
          active := active \ {r};
          failed := failed \union {r};
        }
      }
    } or {
      await Apps = completed \cup failed;
      skip;
    }
  }
}
=============================================================================