import './toolbar.css'

export default function Toolbar({ toggleBlockType, toggleInlineStyle }) {
    return (
        <div style={{ marginBottom: '10px' }}>
            {/* Block styles */}
            <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('header-one'); }}>H1</button>
            <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('header-two'); }}>H2</button>
            <button onMouseDown={(e) => { e.preventDefault(); toggleBlockType('blockquote'); }}>Blockquote</button>

            {/* Inline styles */}
            <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('BOLD'); }}>Bold</button>
            <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('ITALIC'); }}>Italic</button>
            <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('UNDERLINE'); }}>Underline</button>
            <button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('CODE'); }}>Code</button>
        </div>
    );
}
