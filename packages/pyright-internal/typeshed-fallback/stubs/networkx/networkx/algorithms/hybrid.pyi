from networkx.utils.backends import _dispatchable

@_dispatchable
def kl_connected_subgraph(G, k, l, low_memory: bool = False, same_as_graph: bool = False): ...
@_dispatchable
def is_kl_connected(G, k, l, low_memory: bool = False): ...
