function verificarChecklist() {
    const categorias = {
        "disciplina": "Que tal conectar mais disciplinas STEAM em sua aula?",
        "problema": "Considere adicionar um problema real para engajar os alunos!",
        "tecnologia": "Sugestão: Use um simulador online ou ferramentas digitais para mais interação.",
        "criatividade": "Que tal incentivar brainstorms ou permitir mais liberdade criativa?",
        "experimentacao": "Que tal inserir mais prática em sua aula?",
        "colaboracao": "Tente incluir atividades em equipe para promover colaboração.",
        "aprimoramento": "Que tal trazer mais reflexões em sua aula para os aluno?",
        "impacto": "Vamos acrescentar mais impacto em sua aula?"
    };
    
    let validado = true;
    let sugestoes = [];
    
    for (const categoria in categorias) {
        const checkboxes = document.getElementsByName(categoria);
        const marcado = Array.from(checkboxes).some(checkbox => checkbox.checked);
        if (!marcado) {
            validado = false;
            sugestoes.push(categorias[categoria]);
        }
    }
    
    const resultado = document.getElementById("result");
    const sugestoesDiv = document.getElementById("suggestions");
    
    if (validado) {
        resultado.innerText = "✅ Parabéns! Sua aula segue a metodologia STEAM!";
        resultado.style.color = "green";
        sugestoesDiv.style.display = "none";
    } else {
        resultado.innerText = "⚠️ Ainda faltam alguns elementos para sua aula ser STEAM!";
        resultado.style.color = "red";
        sugestoesDiv.innerHTML = "<strong>Sugestões de melhoria:</strong><br>" + sugestoes.join("<br>");
        sugestoesDiv.style.display = "block";
    }
}