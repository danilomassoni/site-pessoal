let items = [];
let classes = [];

function addClass() {
    const input = document.getElementById('newClass');
    const className = input.value.trim();
    
    if (className && !classes.includes(className)) {
        classes.push(className);
        updateClassesList();
        updateClassSelect();
        input.value = '';
    }
}

function removeClass(className) {
    const index = classes.indexOf(className);
    if (index > -1) {
        if (confirm(`Remover a classe "${className}"? Isso não afetará os itens existentes.`)) {
            classes.splice(index, 1);
            updateClassesList();
            updateClassSelect();
        }
    }
}

function updateClassesList() {
    const list = document.getElementById('classesList');
    list.innerHTML = '';
    
    classes.forEach(className => {
        const div = document.createElement('div');
        div.className = 'class-tag';
        div.innerHTML = `
            <span>${className}</span>
            <button onclick="removeClass('${className}')" class="remove-btn">×</button>
        `;
        list.appendChild(div);
    });
}

function updateClassSelect() {
    const select = document.getElementById('itemClass');
    select.innerHTML = '<option value="">Selecione uma classe</option>';
    
    classes.forEach(className => {
        select.innerHTML += `<option value="${className}">${className}</option>`;
    });
}

function addItem() {
    const input = document.getElementById('newItem');
    const classSelect = document.getElementById('itemClass');
    const text = input.value.trim();
    const itemClass = classSelect.value;
    
    if (text) {
        if (!itemClass) {
            alert('Por favor, selecione uma classe para o item.');
            return;
        }
        
        items.push({
            text: text,
            checked: false,
            class: itemClass
        });
        updateList();
        input.value = '';
    }
}

function removeItem(index) {
    items.splice(index, 1);
    updateList();
}

function toggleCheck(index) {
    items[index].checked = !items[index].checked;
    updateList();
}

function updateList() {
    const list = document.getElementById('itemsList');
    list.innerHTML = '';
    
    // Agrupar itens por classe
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.class]) {
            acc[item.class] = [];
        }
        acc[item.class].push(item);
        return acc;
    }, {});

    // Criar lista agrupada
    Object.entries(groupedItems).forEach(([className, classItems]) => {
        const classHeader = document.createElement('h3');
        classHeader.textContent = className;
        classHeader.style.marginTop = '1rem';
        list.appendChild(classHeader);

        classItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'checklist-item';
            
            li.innerHTML = `
                <input type="checkbox" ${item.checked ? 'checked' : ''} 
                       onchange="toggleCheck(${items.indexOf(item)})">
                <span style="${item.checked ? 'text-decoration: line-through' : ''}">${item.text}</span>
                <span class="item-class-tag">${item.class}</span>
                <button onclick="removeItem(${items.indexOf(item)})" class="remove-btn">Remover</button>
            `;
            
            list.appendChild(li);
        });
    });
}

function clearList() {
    if (confirm('Tem certeza que deseja limpar a lista?')) {
        items = [];
        updateList();
    }
}

function exportPDF() {
    const projectName = document.getElementById('projectName').value.trim() || 'Checklist';
    
    // Criar array de todos os itens com suas classes
    let allItems = [];
    Object.entries(items.reduce((acc, item) => {
        if (!acc[item.class]) {
            acc[item.class] = [];
        }
        acc[item.class].push(item);
        return acc;
    }, {})).forEach(([className, classItems]) => {
        allItems.push({
            type: 'header',
            className: className
        });
        classItems.forEach(item => {
            allItems.push({
                type: 'item',
                ...item
            });
        });
    });

    // Dividir itens em páginas de 4 colunas
    const itemsPerColumn = 25;
    const itemsPerPage = itemsPerColumn * 4;
    const pages = [];
    
    // Distribuir itens em páginas
    for (let i = 0; i < allItems.length; i += itemsPerPage) {
        const pageItems = allItems.slice(i, i + itemsPerPage);
        const pageColumns = [];
        
        // Distribuir itens em colunas
        for (let j = 0; j < 4; j++) {
            pageColumns.push(pageItems.slice(j * itemsPerColumn, (j + 1) * itemsPerColumn));
        }
        
        pages.push(pageColumns);
    }

    // Criar elemento temporário para o PDF
    const element = document.createElement('div');
    element.style.padding = '10px';
    element.style.backgroundColor = 'white';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.width = '297mm';
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.left = '0';
    element.style.zIndex = '-9999';

    let content = '';

    // Gerar conteúdo para cada página
    pages.forEach((pageColumns, pageIndex) => {
        content += `
            ${pageIndex > 0 ? '<div style="page-break-before: always;"></div>' : ''}
            <div style="min-height: 200mm; display: flex; flex-direction: column;">
                ${pageIndex === 0 ? `
                    <div style="text-align: center; margin-bottom: 10px;">
                        <h1 style="color: #333; margin: 0; font-size: 18px;">${projectName}</h1>
                        <p style="color: #666; font-size: 11px; margin: 2px 0;">Gerado em: ${new Date().toLocaleDateString()}</p>
                    </div>
                ` : ''}
                <div style="display: flex; gap: 8px; justify-content: space-between; flex: 1;">
                    ${pageColumns.map(columnItems => `
                        <div style="width: 24%; display: flex; flex-direction: column;">
                            ${columnItems.map(item => {
                                if (item.type === 'header') {
                                    return `
                                        <h2 style="color: #333; font-size: 13px; border-bottom: 1px solid #98C9A3; padding-bottom: 2px; margin: 8px 0 4px;">
                                            ${item.className}
                                        </h2>
                                    `;
                                } else {
                                    return `
                                        <div style="display: flex; align-items: center; padding: 3px 4px; background-color: #f5f5f5; font-size: 11px; border-radius: 3px; margin-bottom: 2px;">
                                            <div style="min-width: 12px; height: 12px; border: 1px solid #333; margin-right: 6px; display: flex; align-items: center; justify-content: center; background-color: ${item.checked ? '#98C9A3' : 'white'}">
                                                ${item.checked ? '<span style="color: white; font-size: 8px;">✓</span>' : ''}
                                            </div>
                                            <span style="${item.checked ? 'text-decoration: line-through; color: #666;' : ''}">${item.text}</span>
                                        </div>
                                    `;
                                }
                            }).join('')}
                        </div>
                    `).join('')}
                </div>
                ${pageIndex === pages.length - 1 ? `
                    <div style="margin-top: 8px; padding-top: 4px; border-top: 1px solid #ddd; text-align: center; font-size: 11px;">
                        <p style="margin: 1px 0;">Total de itens: ${items.length}</p>
                        <p style="margin: 1px 0;">Itens concluídos: ${items.filter(item => item.checked).length}</p>
                    </div>
                ` : ''}
            </div>
        `;
    });

    element.innerHTML = content;
    document.body.appendChild(element);

    // Configurações do PDF
    const opt = {
        margin: [5, 5, 5, 5],
        filename: `${projectName.toLowerCase().replace(/\s+/g, '-')}-checklist.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: 0,
            height: element.offsetHeight,
            windowHeight: element.offsetHeight
        },
        jsPDF: { 
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape'
        }
    };

    // Gerar PDF
    html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
            document.body.removeChild(element);
        })
        .catch(err => {
            console.error('Erro ao gerar PDF:', err);
            alert('Erro ao gerar o PDF. Por favor, tente novamente.');
            document.body.removeChild(element);
        });
}

// Permitir adicionar item com Enter
document.getElementById('newItem').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addItem();
    }
});

document.getElementById('newClass').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addClass();
    }
}); 