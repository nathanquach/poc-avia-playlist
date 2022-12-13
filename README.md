## Prerequisite

### [Java](https://www.java.com/en/download/)

### [Graphviz](https://plantuml.com/graphviz-dot#9a211dc025db33c8)
```
arch -x86_64 brew install libtool
arch -x86_64 brew link libtool
arch -x86_64 brew install graphviz
arch -x86_64 brew link --overwrite graphviz
```

More about PlantUML [here](https://plantuml.com/starting)

## Build diagram

```
java -jar diagrams/plantuml.jar diagrams/playlistSequenceDiagram.puml
```