export default function ChunkRecipes(ListRecipes:any[]) {
    const chunks = [];
    let i = 0
    for (i = 0; (i < ListRecipes.length && (i + 5) < ListRecipes.length); i += 5) {
        chunks.push(ListRecipes.slice(i, i + 5));
    }
    chunks.push(ListRecipes.slice(i, ListRecipes.length-1))
    return chunks;
}