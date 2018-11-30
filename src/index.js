import axios from "axios";
import "jspdf";
import "jspdf-autotable";
let jsPDF;

const sayHello = () => {
    /*eslint-disable no-console */
    console.log("Allo! We are all set!");
    console.log("Arrow functions are working");
};

const list = async function() {
    const results = await axios.get("http://localhost:8080/api/v1/public/list");
    const mergeFields = await axios.get(
        "http://localhost:8080/api/v1/public/list/merge-fields"
    );

    const mergedResults = results.data.members.map(result => {
        console.log(result);
        for (let field in result.merge_fields) {
            const mergeField = mergeFields.data.merge_fields.filter(mf => {
                return mf.tag === field;
            })[0];

            result[mergeField.name.replace(" ", "_").toLowerCase()] =
                result.merge_fields[field];
        }
        return result;
    });
    console.log(mergedResults);
    var doc = new jsPDF("p", "pt");

    var columns = [
        { title: "ID", dataKey: "id" },
        { title: "Name", dataKey: "name" },
        { title: "Country", dataKey: "country" }
    ];
    var rows = [results.data.members];

    // Only pt supported (not mm or in)
    doc.autoTable(columns, rows, {
        styles: { fillColor: [100, 255, 255] },
        columnStyles: {
            id: { fillColor: 255 }
        },
        margin: { top: 60 },
        addPageContent: function() {
            doc.text("Header", 40, 30);
        }
    });
    // doc.save("table.pdf");
};
console.log(list());
sayHello();
